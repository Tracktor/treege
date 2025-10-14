import { Edge, Node } from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormValues, ProcessedNode } from "@/renderer/types/renderer";
import { evaluateConditions } from "@/renderer/utils/conditionEvaluator";
import { ConditionalEdgeData } from "@/shared/types/edge";
import { InputNodeData, TreegeNodeData } from "@/shared/types/node";
import { isInputNode } from "@/shared/utils/nodeTypeGuards";

/**
 * Graph utilities for navigating the decision tree
 */
class FlowGraph {
  private nodeMap: Map<string, Node<TreegeNodeData>>;

  private edgeMap: Map<string, Edge<ConditionalEdgeData>[]>;

  private incomingEdgeMap: Map<string, Edge<ConditionalEdgeData>[]>;

  constructor(nodes: Node<TreegeNodeData>[], edges: Edge<ConditionalEdgeData>[]) {
    this.nodeMap = new Map(nodes.map((node) => [node.id, node]));

    // Build outgoing edges map
    this.edgeMap = new Map();
    edges.forEach((edge) => {
      const outgoing = this.edgeMap.get(edge.source) || [];
      outgoing.push(edge);
      this.edgeMap.set(edge.source, outgoing);
    });

    // Build incoming edges map
    this.incomingEdgeMap = new Map();
    edges.forEach((edge) => {
      const incoming = this.incomingEdgeMap.get(edge.target) || [];
      incoming.push(edge);
      this.incomingEdgeMap.set(edge.target, incoming);
    });
  }

  getNode(nodeId: string): Node<TreegeNodeData> | undefined {
    return this.nodeMap.get(nodeId);
  }

  getOutgoingEdges(nodeId: string): Edge<ConditionalEdgeData>[] {
    return this.edgeMap.get(nodeId) || [];
  }

  getIncomingEdges(nodeId: string): Edge<ConditionalEdgeData>[] {
    return this.incomingEdgeMap.get(nodeId) || [];
  }

  getAllNodes(): Node<TreegeNodeData>[] {
    return Array.from(this.nodeMap.values());
  }

  /**
   * Find the start node (node without incoming edges)
   */
  findStartNode(): Node<TreegeNodeData> | undefined {
    const nodesWithoutIncoming = this.getAllNodes().filter((node) => this.getIncomingEdges(node.id).length === 0);

    // Prefer input nodes as start, otherwise take first node
    return nodesWithoutIncoming.find(isInputNode) || nodesWithoutIncoming[0];
  }

  /**
   * Check if a field has a value (not empty)
   */
  hasValue(fieldName: string | undefined, formValues: FormValues): boolean {
    if (!fieldName) return false;
    const value = formValues[fieldName];
    return value !== undefined && value !== null && value !== "";
  }

  /**
   * Find visible nodes using progressive rendering logic
   * - Show start node
   * - For each visible node with a filled field, show next nodes based on conditions
   * - For nodes without conditions, show them if parent is visible and filled
   */
  findVisibleNodes(fromNodeId: string, formValues: FormValues): Set<string> {
    const visible = new Set<string>();
    const queue: string[] = [fromNodeId];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const nodeId = queue.shift()!;

      if (visited.has(nodeId)) continue;
      visited.add(nodeId);
      visible.add(nodeId);

      const node = this.getNode(nodeId);
      if (!node) continue;

      // Check if this node is an input with a value
      let nodeHasValue = true;
      if (isInputNode(node)) {
        const inputData = node.data as InputNodeData;
        nodeHasValue = this.hasValue(inputData.name, formValues);
      }

      // Get outgoing edges
      const outgoingEdges = this.getOutgoingEdges(nodeId);

      // If node has no value yet, don't traverse further (wait for user input)
      if (!nodeHasValue && isInputNode(node)) {
        continue;
      }

      // Traverse outgoing edges
      outgoingEdges.forEach((edge) => {
        const conditions = edge.data?.conditions;

        // If edge has no conditions, always follow it
        if (!conditions || conditions.length === 0) {
          queue.push(edge.target);
          return;
        }

        // If edge has conditions, check if they're met
        if (evaluateConditions(conditions, formValues)) {
          queue.push(edge.target);
        }
      });
    }

    return visible;
  }
}

/**
 * Build a hierarchical tree structure for rendering
 * This respects parent-child relationships while checking visibility
 */
const buildRenderTree = (nodes: Node<TreegeNodeData>[], visibleNodeIds: Set<string>, parentId?: string): ProcessedNode[] => {
  const childNodes = nodes.filter((node) => node.parentId === parentId);

  return childNodes.map((node) => {
    const children = buildRenderTree(nodes, visibleNodeIds, node.id);
    const visible = visibleNodeIds.has(node.id);

    return {
      children,
      node,
      visible,
    };
  });
};

/**
 * Hook to manage form state and node visibility based on conditions
 */
export const useTreegeForm = (nodes: Node<TreegeNodeData>[], edges: Edge<ConditionalEdgeData>[], initialValues: FormValues = {}) => {
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Build graph representation
  const graph = useMemo(() => new FlowGraph(nodes, edges), [nodes, edges]);

  // Find start node
  const startNode = useMemo(() => graph.findStartNode(), [graph]);

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

    return graph.findVisibleNodes(startNode.id, formValues);
  }, [graph, startNode, formValues]);

  /**
   * Process nodes into a tree structure with visibility
   */
  const processedNodes = useMemo(() => buildRenderTree(nodes, visibleNodeIds), [nodes, visibleNodeIds]);

  /**
   * Get all visible nodes (flattened)
   */
  const visibleNodes = useMemo(() => {
    const flatten = (pNodes: ProcessedNode[]): Node<TreegeNodeData>[] =>
      pNodes.flatMap((pNode) => {
        const children = pNode.children ? flatten(pNode.children) : [];
        return pNode.visible ? [pNode.node, ...children] : children;
      });

    return flatten(processedNodes);
  }, [processedNodes]);

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
        const inputData = node.data as InputNodeData;
        const fieldName = inputData.name;

        if (!fieldName) return;

        const value = formValues[fieldName];

        // Required validation
        if (inputData.required) {
          if (value === undefined || value === null || value === "") {
            newErrors[fieldName] = inputData.errorMessage || "This field is required";
            return;
          }
        }

        // Pattern validation (only if value is not empty)
        if (value && inputData.pattern) {
          try {
            const regex = new RegExp(inputData.pattern);
            if (!regex.test(String(value))) {
              newErrors[fieldName] = inputData.errorMessage || "Invalid format";
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

  /**
   * Initialize form values from default values in input nodes
   */
  useEffect(() => {
    const defaultValues: FormValues = { ...initialValues };

    nodes.forEach((node) => {
      if (isInputNode(node)) {
        const inputData = node.data as InputNodeData;
        const fieldName = inputData.name;

        if (!fieldName || defaultValues[fieldName] !== undefined) return;

        const { defaultValue } = inputData;
        if (!defaultValue) return;

        // Handle static default value
        if (defaultValue.type === "static" && defaultValue.staticValue !== undefined) {
          defaultValues[fieldName] = defaultValue.staticValue;
        }

        // Handle reference default value
        if (defaultValue.type === "reference" && defaultValue.referenceField) {
          const { referenceField } = defaultValue;
          const refValue = formValues[referenceField];
          if (refValue !== undefined) {
            defaultValues[fieldName] = refValue;
          }
        }
      }
    });

    setFormValues(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return {
    errors,
    formValues,
    getFieldValue,
    processedNodes,
    resetForm,
    setErrors,
    setFieldValue,
    validateForm,
    visibleNodes,
  };
};