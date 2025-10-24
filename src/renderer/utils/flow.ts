import { Edge, Node } from "@xyflow/react";
import { FormValues } from "@/renderer/types/renderer";
import { evaluateConditions } from "@/renderer/utils/conditions";
import { checkFormFieldHasValue } from "@/renderer/utils/form";
import { ConditionalEdgeData } from "@/shared/types/edge";
import { Flow, FlowNodeData, TreegeNodeData } from "@/shared/types/node";
import { isFlowNode, isInputNode } from "@/shared/utils/nodeTypeGuards";

/**
 * Result from computing the flow render state
 * Contains everything needed to render the form and determine its state
 */
export interface FlowRenderState {
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
    if (list) {
      list.push(edge);
    } else {
      map.set(edge.source, [edge]);
    }
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

  // 1. Always follow edges without conditions (excluding fallbacks)
  const unconditional = edges.filter((e) => (!e.data?.conditions || e.data.conditions.length === 0) && !e.data?.isFallback);
  edgesToFollow.push(...unconditional);

  // 2. Handle edges with conditions (excluding fallbacks)
  const conditional = edges.filter((e) => e.data?.conditions?.length && !e.data?.isFallback);

  if (conditional.length > 0) {
    // Check if all required fields are filled
    const allFieldsFilled = conditional.every((edge) => {
      if (!edge.data?.conditions) {
        return false;
      }

      return edge.data.conditions.every((cond) => {
        if (!cond.field) {
          return true;
        }

        const fieldNode = nodeMap.get(cond.field);
        const fieldName = isInputNode(fieldNode) ? fieldNode.id : cond.field;
        return checkFormFieldHasValue(fieldName, formValues);
      });
    });

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

/**
 * Get the complete render state for the flow
 *
 * This is the MAIN function that computes everything needed to render the form:
 * 1. Finds the start node (node without incoming edges)
 * 2. Determines which nodes should be visible based on form values and edge conditions
 * 3. Orders them in the correct flow sequence for rendering
 * 4. Detects if we've reached the end of the path (important for submit button state)
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
 * @param nodes - All nodes from the editor
 * @param edges - All edges from the editor
 * @param formValues - Current form values
 * @returns Complete flow render state (visible nodes, end-of-path flag, etc.)
 */
export const getFlowRenderState = (
  nodes: Node<TreegeNodeData>[],
  edges: Edge<ConditionalEdgeData>[],
  formValues: FormValues,
): FlowRenderState => {
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
    if (visited.has(nodeId)) {
      return;
    }

    visited.add(nodeId);
    orderedNodeIds.add(nodeId);

    const node = nodeMap.get(nodeId);

    if (!node) {
      return;
    }

    orderedNodes.push(node);

    const outgoingEdges = edgeMap.get(nodeId) || [];
    const { edgesToFollow, waitingForInput } = determineEdgesToFollow(outgoingEdges, formValues, nodeMap);

    if (waitingForInput) {
      hasUnexploredPaths = true;
      return;
    }

    edgesToFollow.forEach((edge) => {
      traverse(edge.target);
    });
  };

  traverse(startNode.id);

  // Add parent groups to visible nodes if a child is visible
  const visibleNodeIds = new Set(orderedNodeIds);
  const idToNode = new Map(nodes.map((n) => [n.id, n]));

  // Create order index from flow traversal to maintain correct order
  const orderIndex = new Map(orderedNodes.map((n, i) => [n.id, i]));

  // Assign group nodes the index of their first child in the flow
  nodes.forEach((node) => {
    if (!orderedNodeIds.has(node.id)) {
      return;
    }

    let { parentId } = node;
    while (parentId) {
      visibleNodeIds.add(parentId);
      // If this parent group doesn't have an order yet, use this child's order
      if (!orderIndex.has(parentId)) {
        const childOrder = orderIndex.get(node.id);
        if (childOrder !== undefined) {
          orderIndex.set(parentId, childOrder);
        }
      }
      parentId = idToNode.get(parentId)?.parentId;
    }
  });

  // Sort all visible nodes by flow order (important for group children)
  const visibleNodes = nodes
    .filter((node) => visibleNodeIds.has(node.id))
    .sort((a, b) => (orderIndex.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (orderIndex.get(b.id) ?? Number.MAX_SAFE_INTEGER));

  // Get root nodes (no parent or parent not visible)
  const visibleRootNodes = visibleNodes.filter((node) => !(node.parentId && visibleNodeIds.has(node.parentId)));

  return {
    endOfPathReached: !hasUnexploredPaths,
    visibleNodeIds,
    visibleNodes,
    visibleRootNodes,
  };
};

/**
 * Merge multiple flows into a single flow by recursively replacing FlowNodes with their target flow's nodes
 *
 * This function takes a flow or an array of flows where the first is the main flow, then:
 * 1. Replaces each FlowNode with the nodes from its target flow
 * 2. Preserves the order of nodes by inserting sub-flow nodes at the FlowNode position
 * 3. Redirects edges that point to FlowNodes to the first node of the target flow
 * 4. Connects the last nodes of sub-flows to the nodes that followed the FlowNode
 *
 * @param flows - A single Flow or an array of flows where the first is the main flow, others are sub-flows (can be null/undefined)
 * @returns A single merged Flow containing all nodes and edges
 */
export const mergeFlows = (flows?: Flow | Flow[] | null): Flow => {
  if (!flows) {
    return {
      edges: [],
      id: "empty",
      nodes: [],
    };
  }

  // Normalize to array and filter out null/undefined values
  const flowArray = Array.isArray(flows) ? flows : [flows];

  // Early return if no flows or empty array
  if (flowArray.length === 0) {
    return {
      edges: [],
      id: "empty",
      nodes: [],
    };
  }

  const mainFlow = flowArray[0];

  // If only one flow, no need to merge - just return it as is
  if (flowArray.length === 1) {
    return mainFlow;
  }

  const mergedNodes: Node<TreegeNodeData>[] = [];
  const mergedEdges: Edge[] = [...mainFlow.edges];
  const processedFlowIds = new Set<string>([mainFlow.id]);
  const flowNodeReplacements = new Map<string, string>(); // Map FlowNode ID -> first node ID of target flow
  const flowNodeTargets = new Map<string, string>(); // Map FlowNode ID -> target flow id

  const processNodes = (nodes: Node<TreegeNodeData>[]): Node<TreegeNodeData>[] => {
    const result: Node<TreegeNodeData>[] = [];

    nodes.forEach((node) => {
      if (isFlowNode(node)) {
        const flowData = node.data as FlowNodeData;
        const targetFlowId = flowData.targetId;

        if (targetFlowId) {
          const targetFlow = flowArray.find((flow) => flow.id === targetFlowId);

          if (targetFlow) {
            // Always map this FlowNode to the first root node of the target flow
            // (even if we've already processed this target flow)
            const firstRootNode = targetFlow.nodes.find((n) => !n.parentId);
            if (firstRootNode) {
              flowNodeReplacements.set(node.id, firstRootNode.id);
            }

            // Track specific target flow for this FlowNode instance
            flowNodeTargets.set(node.id, targetFlowId);

            // Inline sub-flow nodes only once per unique flow id
            if (!processedFlowIds.has(targetFlowId)) {
              processedFlowIds.add(targetFlowId);
              mergedEdges.push(...targetFlow.edges);
              const processedSubFlowNodes = processNodes(targetFlow.nodes);
              result.push(...processedSubFlowNodes);
            }
          } else {
            console.warn(`Flow with id "${targetFlowId}" not found`);
          }
        }
      } else {
        // Add non-flow nodes to result
        result.push(node);
      }
    });

    return result;
  };

  mergedNodes.push(...processNodes(mainFlow.nodes));

  // Find edges that have FlowNodes as source or target
  // We need to connect the last node of the sub-flow to the node that follows the FlowNode
  const edgesFromFlowNodes = new Map<string, Edge[]>(); // FlowNode ID -> edges where FlowNode is source

  mergedEdges.forEach((edge) => {
    if (flowNodeReplacements.has(edge.source)) {
      if (!edgesFromFlowNodes.has(edge.source)) {
        edgesFromFlowNodes.set(edge.source, []);
      }

      const list = edgesFromFlowNodes.get(edge.source);
      if (list) {
        list.push(edge);
      }
    }
  });

  // Replace edges that target FlowNodes with edges that target the first node of the sub-flow
  const updatedEdges = mergedEdges
    .map((edge) => {
      const mappedSource = flowNodeReplacements.get(edge.source);
      const mappedTarget = flowNodeReplacements.get(edge.target);
      if (mappedSource) {
        return null; // will be recreated from terminal nodes
      }
      if (mappedTarget) {
        return { ...edge, target: mappedTarget };
      }
      return edge;
    })
    .filter((edge): edge is Edge => edge !== null);

  // For each FlowNode, find the last nodes of its sub-flow and connect them to the nodes that followed the FlowNode
  flowNodeReplacements.forEach((_firstNodeId, flowNodeId) => {
    const subFlowEdges = edgesFromFlowNodes.get(flowNodeId);

    if (subFlowEdges && subFlowEdges.length > 0) {
      // Find all "terminal" nodes of the sub-flow (nodes that have no outgoing edges within the sub-flow)
      const subFlowNodeIds = new Set<string>();

      // Use the tracked target flow id instead of searching by firstNodeId
      const targetFlowId = flowNodeTargets.get(flowNodeId);
      if (targetFlowId) {
        const targetFlow = flowArray.find((flow) => flow.id === targetFlowId);
        if (targetFlow) {
          targetFlow.nodes.forEach((n) => {
            subFlowNodeIds.add(n.id);
          });
        }
      }

      const nodesWithOutgoingEdges = new Set<string>();
      updatedEdges.forEach((edge) => {
        if (subFlowNodeIds.has(edge.source)) {
          nodesWithOutgoingEdges.add(edge.source);
        }
      });

      const terminalNodes = Array.from(subFlowNodeIds).filter((nodeId) => !nodesWithOutgoingEdges.has(nodeId));

      // Connect terminal nodes to the targets of the original FlowNode edges
      terminalNodes.forEach((terminalNodeId) => {
        subFlowEdges.forEach((originalEdge) => {
          updatedEdges.push({
            ...originalEdge,
            id: `${terminalNodeId}-${originalEdge.target}`,
            source: terminalNodeId,
          });
        });
      });
    }
  });

  return {
    edges: updatedEdges,
    id: mainFlow.id,
    nodes: mergedNodes,
  };
};
