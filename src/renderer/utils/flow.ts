/**
 * Flow Renderer - Core Logic
 *
 * This module contains the two main functions for the renderer:
 * 1. mergeFlows: Preprocesses multiple flows by replacing FlowNodes with their target flows
 * 2. getFlowRenderState: Determines which nodes should be visible based on form values and edge conditions
 *
 * Architecture:
 * - mergeFlows runs once at mount to create a single flat graph
 * - getFlowRenderState runs on every form value change to compute visibility
 * - Both functions are highly optimized for performance (O(1) lookups, minimal iterations)
 */

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
 *
 * This is the output of getFlowRenderState and represents which nodes should be visible
 * based on the current form values and conditional logic.
 */
export interface FlowRenderState {
  /**
   * Whether the end of the flow path has been reached (no more unexplored paths)
   * This does NOT mean the form is valid - just that we've traversed as far as possible
   *
   * Use case: Determines if the submit button should be enabled (endOfPathReached + valid form)
   */
  endOfPathReached: boolean;
  /**
   * Set of all visible node IDs for quick lookup
   *
   * Use case: O(1) check if a node is visible (includes parent groups)
   */
  visibleNodeIds: Set<string>;
  /**
   * All visible nodes (for validation, includes children of groups)
   *
   * Use case: Running validation on all visible input nodes
   */
  visibleNodes: Node<TreegeNodeData>[];
  /**
   * Visible nodes at root level (to render at top-level, ordered by flow)
   *
   * Use case: Rendering the form - only these nodes need to be rendered at the root
   * (their children will be rendered by group components)
   */
  visibleRootNodes: Node<TreegeNodeData>[];
}

/**
 * Build a map of node ID to outgoing edges for O(1) lookup during traversal
 */
const buildEdgeMap = (edges: Edge<ConditionalEdgeData>[]): Map<string, Edge<ConditionalEdgeData>[]> => {
  const map = new Map<string, Edge<ConditionalEdgeData>[]>();
  edges.forEach((edge) => {
    const existing = map.get(edge.source);
    if (existing) {
      existing.push(edge);
    } else {
      map.set(edge.source, [edge]);
    }
  });
  return map;
};

/**
 * Determine which edges to follow from a node
 * Core progressive rendering logic - categorizes edges and applies flow rules
 */
const determineEdgesToFollow = (
  edges: Edge<ConditionalEdgeData>[],
  formValues: FormValues,
  nodeMap: Map<string, Node<TreegeNodeData>>,
): { edgesToFollow: Edge<ConditionalEdgeData>[]; waitingForInput: boolean } => {
  // Categorize edges once for efficiency
  const unconditional: Edge<ConditionalEdgeData>[] = [];
  const conditional: Edge<ConditionalEdgeData>[] = [];
  const fallback: Edge<ConditionalEdgeData>[] = [];

  edges.forEach((edge) => {
    const isFallback = edge.data?.isFallback;
    const hasConditions = edge.data?.conditions?.length;

    if (isFallback) {
      fallback.push(edge);
    } else if (hasConditions) {
      conditional.push(edge);
    } else {
      unconditional.push(edge);
    }
  });

  // 1. Always follow unconditional edges
  const edgesToFollow = [...unconditional];

  // 2. No conditional edges: allow pure fallback navigation if present
  if (conditional.length === 0) {
    if (fallback.length > 0 && edgesToFollow.length === 0) {
      edgesToFollow.push(...fallback);
    }
    return { edgesToFollow, waitingForInput: false };
  }

  // 3. Check if all required fields are filled
  const allFieldsFilled = conditional.every((edge) => {
    const conditions = edge.data?.conditions;
    if (!conditions) {
      return false;
    }
    return conditions.every((cond) => {
      if (!cond.field) {
        return true;
      }
      const fieldNode = nodeMap.get(cond.field);
      const fieldName = isInputNode(fieldNode) ? fieldNode.id : cond.field;
      return checkFormFieldHasValue(fieldName, formValues);
    });
  });

  // 4. If fields not filled, wait for input (unless we have unconditional edges to follow)
  if (!allFieldsFilled) {
    return { edgesToFollow, waitingForInput: edgesToFollow.length === 0 };
  }

  // 5. Evaluate conditions and follow matching edges
  const matching = conditional.filter((e) => evaluateConditions(e.data?.conditions, formValues, nodeMap));

  if (matching.length > 0) {
    edgesToFollow.push(...matching);
    return { edgesToFollow, waitingForInput: false };
  }

  // 6. No match - follow fallback edges if any
  edgesToFollow.push(...fallback);

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
 * Add parent groups to visible node IDs and assign them order indices
 * Mutates visibleNodeIds and orderIndex for efficiency
 */
const addParentGroupsToVisibleNodes = (
  orderedNodeIds: Set<string>,
  visibleNodeIds: Set<string>,
  orderIndex: Map<string, number>,
  nodeMap: Map<string, Node<TreegeNodeData>>,
): void => {
  orderedNodeIds.forEach((nodeId) => {
    const node = nodeMap.get(nodeId);
    if (!node) {
      return;
    }

    let { parentId } = node;
    const seen = new Set<string>();
    while (parentId) {
      if (seen.has(parentId)) {
        break; // cycle guard
      }
      seen.add(parentId);
      visibleNodeIds.add(parentId);
      // If this parent group doesn't have an order yet, use this child's order
      if (!orderIndex.has(parentId)) {
        const childOrder = orderIndex.get(nodeId);
        if (childOrder !== undefined) {
          orderIndex.set(parentId, childOrder);
        }
      }
      parentId = nodeMap.get(parentId)?.parentId;
    }
  });
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
  // Early return for empty flow
  const startNode = findStartNode(nodes, edges);
  if (!startNode) {
    return {
      endOfPathReached: true,
      visibleNodeIds: new Set<string>(),
      visibleNodes: [],
      visibleRootNodes: [],
    };
  }

  // Build lookup maps for O(1) access during traversal
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const edgeMap = buildEdgeMap(edges);

  // State for recursive traversal
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
    const node = nodeMap.get(nodeId);
    if (!node) {
      return;
    }

    orderedNodeIds.add(nodeId);
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

  // Create order index from flow traversal to maintain correct order
  const orderIndex = new Map(orderedNodes.map((node, i) => [node.id, i]));

  // Add parent groups to visible nodes and assign them order indices
  const visibleNodeIds = new Set(orderedNodeIds);
  addParentGroupsToVisibleNodes(orderedNodeIds, visibleNodeIds, orderIndex, nodeMap);

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
 * Detect the main flow from an array of flows
 * The main flow is the one that references other flows but is not referenced by any flow in the array
 *
 * @param flows - Array of flows to analyze
 * @returns The main flow, or the first flow if no clear main flow is found
 */
const detectMainFlow = (flows: Flow[]): Flow => {
  if (flows.length === 1) {
    return flows[0];
  }

  // Build a set of flow IDs that are referenced by FlowNodes
  const flowIds = new Set(flows.map((flow) => flow.id));
  const referencedFlowIds = new Set<string>();

  flows.forEach((flow) => {
    flow.nodes.forEach((node) => {
      if (isFlowNode(node)) {
        const targetId = (node.data as FlowNodeData).targetId;
        if (targetId && flowIds.has(targetId)) {
          referencedFlowIds.add(targetId);
        }
      }
    });
  });

  // The main flow is the one that is NOT referenced by any other flow
  return flows.find((flow) => !referencedFlowIds.has(flow.id)) || flows[0];
};

/**
 * Recursively expand FlowNodes to get all actual node IDs (excluding FlowNodes)
 */
const expandFlowNodeIds = (
  nodeIds: Set<string>,
  flowMap: Map<string, Flow>,
  flowNodeReplacements: Map<string, string>,
  flowNodeTargets: Map<string, string>,
  visitedFlowIds: Set<string> = new Set<string>(),
): Set<string> => {
  const expanded = new Set<string>();

  for (const nodeId of nodeIds) {
    // If this is a FlowNode that was replaced, expand its target flow recursively
    if (flowNodeReplacements.has(nodeId)) {
      const targetFlowId = flowNodeTargets.get(nodeId);
      const targetFlow = targetFlowId ? flowMap.get(targetFlowId) : undefined;
      if (targetFlow) {
        if (targetFlowId && visitedFlowIds.has(targetFlowId)) {
          // cycle detected; skip re-expansion
          continue;
        }
        if (targetFlowId) {
          visitedFlowIds.add(targetFlowId);
        }
        const targetNodeIds = new Set(targetFlow.nodes.map((n) => n.id));
        const expandedTarget = expandFlowNodeIds(targetNodeIds, flowMap, flowNodeReplacements, flowNodeTargets, visitedFlowIds);
        for (const id of expandedTarget) {
          expanded.add(id);
        }
      }
    } else {
      // This is a real node, not a FlowNode
      expanded.add(nodeId);
    }
  }

  return expanded;
};

/**
 * Find terminal nodes (nodes without outgoing edges within the sub-flow)
 */
const findTerminalNodes = (subFlowNodeIds: Set<string>, edges: Edge[]): string[] => {
  const nodesWithOutgoingEdges = new Set<string>();
  edges.forEach((edge) => {
    if (subFlowNodeIds.has(edge.source) && subFlowNodeIds.has(edge.target)) {
      nodesWithOutgoingEdges.add(edge.source);
    }
  });
  return Array.from(subFlowNodeIds).filter((id) => !nodesWithOutgoingEdges.has(id));
};

/**
 * Merge multiple flows into a single flow by recursively replacing FlowNodes with their target flow's nodes
 *
 * This function takes a flow or an array of flows, automatically detects the main flow, then:
 * 1. Replaces each FlowNode with the nodes from its target flow
 * 2. Preserves the order of nodes by inserting sub-flow nodes at the FlowNode position
 * 3. Redirects edges that point to FlowNodes to the first node of the target flow
 * 4. Connects the last nodes of sub-flows to the nodes that followed the FlowNode
 *
 * Main flow detection:
 * - The main flow is automatically identified as the one that references other flows but is not referenced itself
 * - This allows flows to be passed in any order without breaking the merge logic
 *
 * @param flows - A single Flow or an array of flows (can be null/undefined)
 * @returns A single merged Flow containing all nodes and edges
 */
export const mergeFlows = (flows?: Flow | Flow[] | null): Flow => {
  // Early return for null/undefined
  if (!flows) {
    return { edges: [], id: "empty", nodes: [] };
  }

  // Normalize to array
  const flowArray = Array.isArray(flows) ? flows : [flows];
  if (flowArray.length === 0) {
    return { edges: [], id: "empty", nodes: [] };
  }

  // Detect the main flow
  const mainFlow = detectMainFlow(flowArray);

  // If only one flow, no merge needed
  if (flowArray.length === 1) {
    return mainFlow;
  }

  // Build flow lookup map for O(1) access
  const flowMap = new Map(flowArray.map((flow) => [flow.id, flow]));

  // Tracking data for merge process
  const mergedNodes: Node<TreegeNodeData>[] = [];
  const mergedEdges: Edge[] = [...mainFlow.edges];
  const processedFlowIds = new Set<string>([mainFlow.id]);
  const flowNodeReplacements = new Map<string, string>(); // FlowNode ID -> first node ID of target flow
  const flowNodeTargets = new Map<string, string>(); // FlowNode ID -> target flow ID
  const edgesFromFlowNodes = new Map<string, Edge[]>(); // FlowNode ID -> edges where FlowNode is "source"

  /**
   * Process nodes recursively, replacing FlowNodes with their target flow's nodes
   */
  const processNodes = (nodes: Node<TreegeNodeData>[]): Node<TreegeNodeData>[] => {
    const result: Node<TreegeNodeData>[] = [];

    nodes.forEach((node) => {
      if (!isFlowNode(node)) {
        result.push(node);
        return;
      }

      const targetFlowId = (node.data as FlowNodeData).targetId;
      if (!targetFlowId) {
        return;
      }

      const targetFlow = flowMap.get(targetFlowId);
      if (!targetFlow) {
        console.warn(`Flow with id "${targetFlowId}" not found`);
        return;
      }

      // Map FlowNode to the first root node of the target flow
      const firstRootNode = targetFlow.nodes.find((n) => !n.parentId);
      if (firstRootNode) {
        flowNodeReplacements.set(node.id, firstRootNode.id);
      }

      // Track target flow for this FlowNode instance
      flowNodeTargets.set(node.id, targetFlowId);

      // Inline sub-flow nodes only once per unique flow ID
      if (!processedFlowIds.has(targetFlowId)) {
        processedFlowIds.add(targetFlowId);
        mergedEdges.push(...targetFlow.edges);
        result.push(...processNodes(targetFlow.nodes));
      }
    });

    return result;
  };

  mergedNodes.push(...processNodes(mainFlow.nodes));

  // Build map of edges from FlowNodes
  mergedEdges.forEach((edge) => {
    if (flowNodeReplacements.has(edge.source)) {
      const existing = edgesFromFlowNodes.get(edge.source);
      if (existing) {
        existing.push(edge);
      } else {
        edgesFromFlowNodes.set(edge.source, [edge]);
      }
    }
  });

  // Replace edges: remove FlowNode sources, redirect FlowNode targets
  const updatedEdges = mergedEdges
    .map((edge) => {
      if (flowNodeReplacements.has(edge.source)) {
        return null; // Will be recreated from terminal nodes
      }
      const mappedTarget = flowNodeReplacements.get(edge.target);
      return mappedTarget ? { ...edge, target: mappedTarget } : edge;
    })
    .filter((edge): edge is Edge => edge !== null);

  // Connect terminal nodes of sub-flows to nodes that followed the FlowNode
  flowNodeReplacements.forEach((_firstNodeId, flowNodeId) => {
    const subFlowEdges = edgesFromFlowNodes.get(flowNodeId);
    if (!subFlowEdges?.length) {
      return;
    }

    const targetFlowId = flowNodeTargets.get(flowNodeId);
    const targetFlow = targetFlowId ? flowMap.get(targetFlowId) : undefined;
    if (!targetFlow) {
      return;
    }

    // Expand FlowNodes recursively to get only real node IDs (excluding nested FlowNodes)
    const subFlowNodeIds = new Set(targetFlow.nodes.map((node) => node.id));
    const expandedNodeIds = expandFlowNodeIds(
      subFlowNodeIds,
      flowMap,
      flowNodeReplacements,
      flowNodeTargets,
      new Set<string>(targetFlowId ? [targetFlowId] : []),
    );
    const terminalNodes = findTerminalNodes(expandedNodeIds, updatedEdges);

    terminalNodes.forEach((terminalNodeId) => {
      subFlowEdges.forEach((originalEdge) => {
        const mappedTarget = flowNodeReplacements.get(originalEdge.target) ?? originalEdge.target;
        const newEdgeIdBase = originalEdge.id ?? `${flowNodeId}__${originalEdge.target}`;
        updatedEdges.push({
          ...originalEdge,
          id: `${terminalNodeId}__${newEdgeIdBase}`,
          source: terminalNodeId,
          target: mappedTarget,
        });
      });
    });
  });

  return {
    edges: updatedEdges,
    id: mainFlow.id,
    nodes: mergedNodes,
  };
};
