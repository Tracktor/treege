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
export interface VisibleNodesInOrderResult {
  /**
   * Whether the end of the flow path has been reached (no more unexplored paths)
   * This does NOT mean the form is valid - just that we've traversed as far as possible
   */
  endOfPathReached: boolean;
  /**
   * Set of all visible node IDs for quick lookup
   */
  visibleNodeIds: Set<string>;
  /**
   * All visible nodes (for validation, includes children of groups)
   */
  visibleNodes: Node<TreegeNodeData>[];
  /**
   * Visible nodes at root level (to render at top-level, ordered by flow)
   */
  visibleRootNodes: Node<TreegeNodeData>[];
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

    // If fields not filled, defer conditional edges; still follow any unconditional edges
    if (!allFieldsFilled) {
      return { edgesToFollow, waitingForInput: edgesToFollow.length === 0 };
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

// ============================================
// MAIN FUNCTION
// ============================================

/**
 * Get all visible nodes in the correct order for progressive rendering
 *
 * This is the MAIN function - does everything in a single pass:
 * 1. Finds the start node (node without incoming edges)
 * 2. Determines which nodes should be visible based on form values and edge conditions
 * 3. Orders them in the correct flow sequence for rendering
 * 4. Detects if we've reached the end of the path (to show submit button)
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
 * @param nodes - All nodes
 * @param edges - All edges
 * @param formValues - Current form values
 * @returns Object with visible nodes (ordered), submit flag, and visible node IDs set
 */
export const getVisibleNodesInOrder = (
  nodes: Node<TreegeNodeData>[],
  edges: Edge<ConditionalEdgeData>[],
  formValues: FormValues,
): VisibleNodesInOrderResult => {
  // Find the start node (node without incoming edges)
  const startNode = findStartNode(nodes, edges);

  if (!startNode) {
    return {
      endOfPathReached: true,
      visibleNodeIds: new Set<string>(),
      visibleNodes: [],
      visibleRootNodes: [],
    };
  }

  // Build lookup maps access during traversal
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const edgeMap = buildEdgeMap(edges);

  // Nodes discovered during recursive traversal (ordered by flow)
  const orderedNodes: Node<TreegeNodeData>[] = [];
  const orderedNodeIds = new Set<string>();
  const visited = new Set<string>();
  let hasUnexploredPaths = false;

  /**
   * Recursive function to traverse the graph and collect visible nodes
   */
  const traverse = (nodeId: string): void => {
    if (visited.has(nodeId)) return;

    visited.add(nodeId);
    orderedNodeIds.add(nodeId);

    const node = nodeMap.get(nodeId);

    if (!node) return;

    orderedNodes.push(node);

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

  traverse(startNode.id);

  // Add parent groups to visible nodes if a child is visible
  const visibleNodeIds = new Set(orderedNodeIds);
  const idToNode = new Map(nodes.map((n) => [n.id, n]));
  nodes.forEach((node) => {
    if (!orderedNodeIds.has(node.id)) return;

    let { parentId } = node;
    while (parentId) {
      visibleNodeIds.add(parentId);
      parentId = idToNode.get(parentId)?.parentId;
    }
  });

  const visibleNodes = nodes.filter((node) => visibleNodeIds.has(node.id));

  // Get root nodes (no parent or parent not visible), ordered by first appearance in flow
  const orderIndex = new Map(orderedNodes.map((n, i) => [n.id, i]));
  const visibleRootNodes = visibleNodes
    .filter((node) => !node.parentId || !visibleNodeIds.has(node.parentId))
    .sort((a, b) => (orderIndex.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (orderIndex.get(b.id) ?? Number.MAX_SAFE_INTEGER));

  return {
    endOfPathReached: !hasUnexploredPaths,
    visibleNodeIds,
    visibleNodes,
    visibleRootNodes,
  };
};
