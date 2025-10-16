import { Edge, Node } from "@xyflow/react";
import { FormValues } from "@/renderer/types/renderer";
import { evaluateConditions } from "@/renderer/utils/conditionEvaluator";
import { checkHasFormFieldValue } from "@/renderer/utils/form";
import { ConditionalEdgeData } from "@/shared/types/edge";
import { TreegeNodeData } from "@/shared/types/node";
import { isInputNode } from "@/shared/utils/nodeTypeGuards";

/**
 * Build a map of node ID to outgoing edges
 */
export const buildEdgeMap = (edges: Edge<ConditionalEdgeData>[]): Map<string, Edge<ConditionalEdgeData>[]> => {
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
export const buildIncomingEdgeMap = (edges: Edge<ConditionalEdgeData>[]): Map<string, Edge<ConditionalEdgeData>[]> => {
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
export const findStartNode = (
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
export const findVisibleNodes = (
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
                const fieldName = isInputNode(fieldNode) ? fieldNode.id : cond.field;

                return checkHasFormFieldValue(fieldName, formValues);
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
