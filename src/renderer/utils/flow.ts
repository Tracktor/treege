import { Edge, Node } from "@xyflow/react";
import { FormValues } from "@/renderer/types/renderer";
import { evaluateConditions } from "@/renderer/utils/conditions";
import { checkHasFormFieldValue } from "@/renderer/utils/form";
import { ConditionalEdgeData } from "@/shared/types/edge";
import { TreegeNodeData } from "@/shared/types/node";
import { isInputNode } from "@/shared/utils/nodeTypeGuards";

/**
 * Result from the progressive rendering traversal
 * Contains everything needed to render the form and determine its state
 */
export interface VisibleNodesResult {
  /** Ordered array of nodes to render (in flow order) */
  visibleNodes: Node<TreegeNodeData>[];
  /** Whether we've reached the end of the current path (show submit button) */
  isEndOfPath: boolean;
  /** Set of all visible node IDs for quick lookup */
  visibleNodeIds: Set<string>;
}

/**
 * Build a map of node ID to outgoing edges for O(1) lookup during traversal
 */
const buildEdgeMap = (edges: Edge<ConditionalEdgeData>[]): Map<string, Edge<ConditionalEdgeData>[]> => {
  const map = new Map<string, Edge<ConditionalEdgeData>[]>();
  edges.forEach((edge) => {
    const list = map.get(edge.source);
    if (list) list.push(edge);
    else map.set(edge.source, [edge]);
  });
  return map;
};

/**
 * Determine which edges to follow from a node
 * Core progressive rendering logic - simple and direct
 */
const determineEdgesToFollow = (
  edges: Edge<ConditionalEdgeData>[],
  formValues: FormValues,
  nodeMap: Map<string, Node<TreegeNodeData>>,
): { edgesToFollow: Edge<ConditionalEdgeData>[]; waitingForInput: boolean } => {
  const edgesToFollow: Edge<ConditionalEdgeData>[] = [];

  // 1. Always follow edges without conditions
  const unconditional = edges.filter((e) => !e.data?.conditions || e.data.conditions.length === 0);
  edgesToFollow.push(...unconditional);

  // 2. Handle edges with conditions (excluding fallbacks)
  const conditional = edges.filter((e) => e.data?.conditions?.length && !e.data?.isFallback);

  if (conditional.length > 0) {
    // Check if all required fields are filled
    const allFieldsFilled = conditional.every((edge) =>
      edge.data!.conditions!.every((cond) => {
        if (!cond.field) return true;
        const fieldNode = nodeMap.get(cond.field);
        const fieldName = isInputNode(fieldNode) ? fieldNode.id : cond.field;
        return checkHasFormFieldValue(fieldName, formValues);
      }),
    );

    // If fields not filled, wait for user input
    if (!allFieldsFilled) {
      return { edgesToFollow, waitingForInput: true };
    }

    // Evaluate conditions and follow matching edges
    const matching = conditional.filter((e) => evaluateConditions(e.data?.conditions, formValues, nodeMap));

    if (matching.length > 0) {
      edgesToFollow.push(...matching);
    } else {
      // No match - follow fallback edges if any
      const fallback = edges.filter((e) => e.data?.isFallback);
      edgesToFollow.push(...fallback);
    }
  }

  return { edgesToFollow, waitingForInput: false };
};

// ============================================
// MAIN FUNCTION
// ============================================

/**
 * Get all visible nodes in the correct order for progressive rendering
 *
 * This is the MAIN function - does everything in a single recursive traversal:
 * 1. Determines which nodes should be visible based on form values and edge conditions
 * 2. Orders them in the correct flow sequence for rendering
 * 3. Detects if we've reached the end of the path (to show submit button)
 *
 * Progressive Rendering Logic:
 * - Start from the first node (no incoming edges)
 * - Show the current node
 * - If the node has outgoing edges:
 *   - Unconditional edges: always follow
 *   - Conditional edges: only follow if conditions are met AND all required fields are filled
 *   - Fallback edges: follow only if no conditional edges match
 * - If we encounter a node where conditional fields are not yet filled, STOP (wait for user input)
 * - Continue until no more nodes can be revealed
 *
 * @param startNodeId - The ID of the start node
 * @param nodes - All nodes
 * @param edges - All edges
 * @param formValues - Current form values
 * @returns Object with visible nodes (ordered), end-of-path flag, and visible node IDs set
 */
export const getVisibleNodesInOrder = (
  startNodeId: string,
  nodes: Node<TreegeNodeData>[],
  edges: Edge<ConditionalEdgeData>[],
  formValues: FormValues,
): VisibleNodesResult => {
  // Build lookup maps for O(1) access during traversal
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const edgeMap = buildEdgeMap(edges);

  const visibleNodes: Node<TreegeNodeData>[] = [];
  const visibleNodeIds = new Set<string>();
  const visited = new Set<string>();
  let hasUnexploredPaths = false;

  /**
   * Recursive function to traverse the graph and collect visible nodes
   */
  const traverse = (nodeId: string): void => {
    if (visited.has(nodeId)) return;

    visited.add(nodeId);
    visibleNodeIds.add(nodeId);

    const node = nodeMap.get(nodeId);
    if (!node) return;

    visibleNodes.push(node);

    const outgoingEdges = edgeMap.get(nodeId) || [];
    const { edgesToFollow, waitingForInput } = determineEdgesToFollow(outgoingEdges, formValues, nodeMap);

    if (waitingForInput) {
      hasUnexploredPaths = true;
      return;
    }

    if (outgoingEdges.length > 0 && edgesToFollow.length === 0) {
      hasUnexploredPaths = true;
    }

    edgesToFollow.forEach((edge) => traverse(edge.target));
  };

  traverse(startNodeId);

  return {
    isEndOfPath: !hasUnexploredPaths,
    visibleNodeIds,
    visibleNodes,
  };
};

/**
 * Check if a node is the start node (has no incoming edges)
 * Used by UI components to determine if a node is the first in the flow
 */
export const isStartNode = (nodeId: string, edges: Edge[]): boolean => !edges.some((edge) => edge.target === nodeId);

/**
 * Find the start node (node without incoming edges)
 * Prefers input nodes as the start, otherwise takes the first node found
 */
export const findStartNode = (nodes: Node<TreegeNodeData>[], edges: Edge[]): Node<TreegeNodeData> | undefined => {
  const nodesWithoutIncoming = nodes.filter((node) => isStartNode(node.id, edges));
  return nodesWithoutIncoming.find(isInputNode) || nodesWithoutIncoming[0];
};
