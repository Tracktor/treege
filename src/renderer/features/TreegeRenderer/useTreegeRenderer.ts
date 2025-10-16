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

          // Follow all unconditional edges immediately (no gating)
          unconditionalEdges.forEach((edge) => {
            queue.push(edge.target);
          });

          // Handle conditional edges (branching)
          if (conditionalEdges.length > 0) {
            // Separate fallback edges from regular conditional edges
            const fallbackEdges = conditionalEdges.filter((edge) => edge.data?.isFallback);
            const regularConditionalEdges = conditionalEdges.filter((edge) => !edge.data?.isFallback);

            // Check if all condition fields for regular edges are filled
            const allConditionFieldsFilled = regularConditionalEdges.every((edge) => {
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
              const matchingEdges = regularConditionalEdges.filter((edge) => {
                const conditions = edge.data?.conditions || [];
                return evaluateConditions(conditions, formValues, nodeMap);
              });

              if (matchingEdges.length > 0) {
                // Follow all matching edges
                matchingEdges.forEach((edge) => queue.push(edge.target));
              } else if (fallbackEdges.length > 0) {
                // No conditions matched - follow the fallback edge(s)
                fallbackEdges.forEach((edge) => queue.push(edge.target));
              }
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
  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const edgeMap = useMemo(() => buildEdgeMap(edges), [edges]);
  const incomingEdgeMap = useMemo(() => buildIncomingEdgeMap(edges), [edges]);
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
   * Get top-level visible nodes (nodes without parent or with invisible parent)
   */
  const topLevelNodes = useMemo(
    () => visibleNodes.filter((node) => !node.parentId || !visibleNodes.some((n) => n.id === node.parentId)),
    [visibleNodes],
  );

  /**
   * Check if we're at the end of a path (no more nodes can be revealed)
   * We're at the end when there are no outgoing edges from any visible node
   * that could potentially lead to new nodes
   */
  const isEndOfPath = useMemo(() => {
    // Check if there are any visible nodes with outgoing edges that could reveal new nodes
    const hasUnexploredPaths = visibleNodes.some((node) => {
      const outgoing = edgeMap.get(node.id) || [];

      return outgoing.some((edge) => {
        // If target is already visible, this edge won't reveal anything new
        if (visibleNodeIds.has(edge.target)) return false;

        // Check if this is an unconditional edge
        const conditions = edge.data?.conditions || [];
        if (conditions.length === 0) {
          // Unconditional edge to non-visible node - this should have been followed already
          // This means we're not at the end yet (edge will be followed when conditions are met)
          return true;
        }

        // For fallback edges, check if there are any other edges from the same source
        // that could match instead
        if (edge.data?.isFallback) {
          // Get all edges from the same source
          const edgesFromSource = edgeMap.get(node.id) || [];
          const nonFallbackEdges = edgesFromSource.filter((e) => !e.data?.isFallback && e.id !== edge.id);

          // Check if any non-fallback edge conditions are filled
          const hasFilledNonFallbackEdges = nonFallbackEdges.some((e) => {
            const conds = e.data?.conditions || [];
            if (conds.length === 0) return true; // Unconditional edge

            return conds.every((cond) => {
              if (!cond.field) return true;
              const fieldNode = nodeMap.get(cond.field);
              const fieldName = isInputNode(fieldNode) ? getFieldName(fieldNode) : cond.field;
              return hasValue(fieldName, formValues);
            });
          });

          // If non-fallback edges have conditions filled but none match, fallback is unexplored
          if (hasFilledNonFallbackEdges) {
            const anyNonFallbackMatches = nonFallbackEdges.some((e) => {
              const conds = e.data?.conditions || [];
              return evaluateConditions(conds, formValues, nodeMap);
            });

            // Fallback is unexplored only if no non-fallback edges match
            return !anyNonFallbackMatches;
          }

          // If non-fallback conditions are not filled, we might not need fallback
          return true;
        }

        // For regular conditional edges, check if the conditions COULD be met in the future
        // If all condition fields are already filled, check if conditions evaluate to true
        const allConditionFieldsFilled = conditions.every((cond) => {
          if (!cond.field) return true;

          const fieldNode = nodeMap.get(cond.field);
          const fieldName = isInputNode(fieldNode) ? getFieldName(fieldNode) : cond.field;

          return hasValue(fieldName, formValues);
        });

        // If not all fields are filled, we might follow this edge in the future
        if (!allConditionFieldsFilled) return true;

        // If all fields are filled, check if conditions evaluate to true
        // If false, this edge will never be followed, so it doesn't count as unexplored
        return evaluateConditions(conditions, formValues, nodeMap);
      });
    });

    // We're at the end if there are no unexplored paths
    return !hasUnexploredPaths;
  }, [visibleNodes, edgeMap, visibleNodeIds, nodeMap, formValues]);

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
    isEndOfPath,
    resetForm,
    setErrors,
    setFieldValue,
    topLevelNodes,
    validateForm,
    visibleNodes,
  };
};
