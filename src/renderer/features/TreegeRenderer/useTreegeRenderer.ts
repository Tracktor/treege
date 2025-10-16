import { Edge, Node } from "@xyflow/react";
import { useCallback, useMemo, useState } from "react";
import { FormValues } from "@/renderer/types/renderer";
import { evaluateConditions } from "@/renderer/utils/conditionEvaluator";
import { getFieldName } from "@/renderer/utils/helpers";
import { ConditionalEdgeData } from "@/shared/types/edge";
import { TreegeNodeData } from "@/shared/types/node";
import { isInputNode } from "@/shared/utils/nodeTypeGuards";

/**
 * Check if a field has a value (not empty)
 */
const hasValue = (fieldName: string | undefined, formValues: FormValues): boolean => {
  if (!fieldName) return false;
  const value = formValues[fieldName];
  return value !== undefined && value !== null && value !== "";
};

/**
 * Build a map of node ID to outgoing edges
 */
const buildEdgeMap = (edges: Edge<ConditionalEdgeData>[]): Map<string, Edge<ConditionalEdgeData>[]> => {
  const edgeMap = new Map<string, Edge<ConditionalEdgeData>[]>();
  edges.forEach((edge) => {
    const outgoing = edgeMap.get(edge.source) || [];
    outgoing.push(edge);
    edgeMap.set(edge.source, outgoing);
  });
  return edgeMap;
};

/**
 * Build a map of node ID to incoming edges
 */
const buildIncomingEdgeMap = (edges: Edge<ConditionalEdgeData>[]): Map<string, Edge<ConditionalEdgeData>[]> => {
  const incomingEdgeMap = new Map<string, Edge<ConditionalEdgeData>[]>();
  edges.forEach((edge) => {
    const incoming = incomingEdgeMap.get(edge.target) || [];
    incoming.push(edge);
    incomingEdgeMap.set(edge.target, incoming);
  });
  return incomingEdgeMap;
};

/**
 * Find the start node (node without incoming edges)
 */
const findStartNode = (
  nodes: Node<TreegeNodeData>[],
  incomingEdgeMap: Map<string, Edge<ConditionalEdgeData>[]>,
): Node<TreegeNodeData> | undefined => {
  const nodesWithoutIncoming = nodes.filter((node) => {
    const incomingEdges = incomingEdgeMap.get(node.id) || [];
    return incomingEdges.length === 0;
  });

  // Prefer input nodes as start, otherwise take first node
  return nodesWithoutIncoming.find(isInputNode) || nodesWithoutIncoming[0];
};

/**
 * Find all visible nodes using branch-based progressive rendering
 *
 * Logic:
 * - Start from the start node
 * - Follow all unconditional edges (always visible)
 * - When reaching a node with multiple conditional edges (a branch point):
 *   - Stop and wait for user input
 *   - Once the user fills the field, evaluate conditions and follow the matching branch
 */
const findVisibleNodes = (
  startNodeId: string,
  nodeMap: Map<string, Node<TreegeNodeData>>,
  edgeMap: Map<string, Edge<ConditionalEdgeData>[]>,
  formValues: FormValues,
): Set<string> => {
  const visible = new Set<string>();
  const visited = new Set<string>();
  const queue: string[] = [startNodeId];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;

    if (!visited.has(nodeId)) {
      visited.add(nodeId);
      visible.add(nodeId);

      const node = nodeMap.get(nodeId);
      if (node) {
        // Get outgoing edges from this node
        const outgoingEdges = edgeMap.get(nodeId) || [];

        if (outgoingEdges.length > 0) {
          // Separate conditional and unconditional edges
          const conditionalEdges = outgoingEdges.filter((edge) => edge.data?.conditions && edge.data.conditions.length > 0);
          const unconditionalEdges = outgoingEdges.filter((edge) => !edge.data?.conditions || edge.data.conditions.length === 0);

          // Always follow unconditional edges (no branching)
          unconditionalEdges.forEach((edge) => {
            queue.push(edge.target);
          });

          // Handle conditional edges (branching)
          if (conditionalEdges.length > 0) {
            // This is a branch point - check if all condition fields have values
            const allConditionFieldsFilled = conditionalEdges.every((edge) => {
              const conditions = edge.data?.conditions || [];
              return conditions.every((cond) => {
                if (!cond.field) return true;

                // Try to resolve field as node ID first
                const fieldNode = nodeMap.get(cond.field);
                const fieldName = isInputNode(fieldNode) ? getFieldName(fieldNode) : cond.field;

                return hasValue(fieldName, formValues);
              });
            });

            // If all fields are filled, evaluate conditions and follow matching branches
            if (allConditionFieldsFilled) {
              conditionalEdges.forEach((edge) => {
                const conditions = edge.data?.conditions || [];
                if (evaluateConditions(conditions, formValues, nodeMap)) {
                  queue.push(edge.target);
                }
              });
            }
            // If fields are not filled, stop here and wait for user input
            // (don't add any conditional targets to the queue)
          }
        }
      }
    }
  }

  return visible;
};

/**
 * Initialize form values with defaults from input nodes
 */
const initializeFormValues = (nodes: Node<TreegeNodeData>[], initialValues: FormValues): FormValues => {
  const defaultValues: FormValues = { ...initialValues };

  nodes.forEach((node) => {
    if (isInputNode(node)) {
      const fieldName = getFieldName(node);

      if (defaultValues[fieldName] !== undefined) return;

      const { defaultValue } = node.data;
      if (!defaultValue) return;

      // Handle static default value
      if (defaultValue.type === "static" && defaultValue.staticValue !== undefined) {
        defaultValues[fieldName] = defaultValue.staticValue;
      }

      // Handle reference default value
      if (defaultValue.type === "reference" && defaultValue.referenceField) {
        const { referenceField } = defaultValue;
        const refValue = defaultValues[referenceField];
        if (refValue !== undefined) {
          defaultValues[fieldName] = refValue;
        }
      }
    }
  });

  return defaultValues;
};

/**
 * Hook to manage renderer state, node visibility, and form values
 */
export const useTreegeRenderer = (nodes: Node<TreegeNodeData>[], edges: Edge<ConditionalEdgeData>[], initialValues: FormValues = {}) => {
  const [formValues, setFormValues] = useState<FormValues>(() => initializeFormValues(nodes, initialValues));
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Build graph maps (memoized)
  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const edgeMap = useMemo(() => buildEdgeMap(edges), [edges]);
  const incomingEdgeMap = useMemo(() => buildIncomingEdgeMap(edges), [edges]);

  // Find start node
  const startNode = useMemo(() => findStartNode(nodes, incomingEdgeMap), [nodes, incomingEdgeMap]);

  /**
   * Calculate which nodes should be visible based on current form values
   * This implements progressive rendering:
   * 1. Start from the start node (always visible)
   * 2. Show next nodes only when:
   *    - Current node has a value (for input nodes)
   *    - Edge conditions are met (if any)
   * 3. This creates a step-by-step form experience
   */
  const visibleNodeIds = useMemo(() => {
    if (!startNode) return new Set<string>();

    return findVisibleNodes(startNode.id, nodeMap, edgeMap, formValues);
  }, [startNode, nodeMap, edgeMap, formValues]);

  /**
   * Get all visible nodes (including parent groups of visible nodes)
   */
  const visibleNodes = useMemo(() => {
    const visible = new Set(visibleNodeIds);

    // Add parent groups of visible nodes
    nodes.forEach((node) => {
      if (visibleNodeIds.has(node.id) && node.parentId) {
        visible.add(node.parentId);
      }
    });

    return nodes.filter((node) => visible.has(node.id));
  }, [nodes, visibleNodeIds]);

  /**
   * Set field value and clear error for that field
   */
  const setFieldValue = useCallback((fieldName: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error when user types
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Get field value
   */
  const getFieldValue = useCallback((fieldName: string) => formValues[fieldName], [formValues]);

  /**
   * Validate form based on visible input nodes
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    visibleNodes.forEach((node) => {
      if (isInputNode(node)) {
        const fieldName = getFieldName(node);
        const value = formValues[fieldName];

        // Required validation
        if (node.data.required) {
          if (value === undefined || value === null || value === "") {
            newErrors[fieldName] = node.data.errorMessage || "This field is required";
            return;
          }
        }

        // Pattern validation (only if value is not empty)
        if (value && node.data.pattern) {
          try {
            const regex = new RegExp(node.data.pattern);
            if (!regex.test(String(value))) {
              newErrors[fieldName] = node.data.errorMessage || "Invalid format";
            }
          } catch (e) {
            console.error(`Invalid pattern for field ${fieldName}:`, e);
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [visibleNodes, formValues]);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setFormValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    errors,
    formValues,
    getFieldValue,
    resetForm,
    setErrors,
    setFieldValue,
    validateForm,
    visibleNodes,
  };
};
