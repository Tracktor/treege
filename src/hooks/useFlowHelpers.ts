import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

/**
 * A custom hook to provide helper functions for analyzing the React Flow graph.
 */
const useFlowHelpers = () => {
  const { getNodes, getEdges } = useReactFlow();

  /**
   * Checks if a node has siblings (multiple nodes connected to the same parent node).
   * @param nodeId - The ID of the node to check.
   * @returns An object containing:
   *   - hasSiblings: boolean indicating if the node has siblings
   *   - siblings: array of sibling node IDs (excluding the node itself)
   *   - parents: array of parent node IDs
   *   - siblingCount: number of siblings
   */
  const getNodeSiblings = useCallback(
    (nodeId: string) => {
      const edges = getEdges();
      const nodes = getNodes();
      const node = nodes.find((n) => n.id === nodeId);

      if (!node) {
        return { hasSiblings: false, parents: [], siblingCount: 0, siblings: [] };
      }

      const incomingEdges = edges.filter((edge) => edge.target === nodeId);

      if (incomingEdges.length === 0) {
        return { hasSiblings: false, parents: [], siblingCount: 0, siblings: [] };
      }

      const allSiblings = new Set<string>();
      const parents = new Set<string>();

      incomingEdges.forEach((edge) => {
        const parentId = edge.source;
        const childrenEdges = edges.filter((e) => e.source === parentId);

        parents.add(parentId);

        childrenEdges.forEach((childEdge) => {
          if (childEdge.target !== nodeId) {
            allSiblings.add(childEdge.target);
          }
        });
      });

      return {
        hasSiblings: allSiblings.size > 0,
        parents: Array.from(parents),
        siblingCount: allSiblings.size,
        siblings: Array.from(allSiblings),
      };
    },
    [getEdges, getNodes],
  );

  /**
   * Checks if a node has siblings.
   * @param nodeId - The ID of the node to check.
   * @returns boolean indicating if the node has siblings.
   */
  const hasSiblings = useCallback((nodeId: string) => getNodeSiblings(nodeId).hasSiblings, [getNodeSiblings]);

  /**
   * Gets all children of a node.
   * @param nodeId - The ID of the parent node.
   * @returns Array of child node IDs.
   */
  const getNodeChildren = useCallback(
    (nodeId: string) => {
      const edges = getEdges();
      return edges.filter((edge) => edge.source === nodeId).map((edge) => edge.target);
    },
    [getEdges],
  );

  /**
   * Gets all parents of a node.
   * @param nodeId - The ID of the child node.
   * @returns Array of parent node IDs.
   */
  const getNodeParents = useCallback(
    (nodeId: string) => {
      const edges = getEdges();
      return edges.filter((edge) => edge.target === nodeId).map((edge) => edge.source);
    },
    [getEdges],
  );

  return {
    getNodeChildren,
    getNodeParents,
    getNodeSiblings,
    hasSiblings,
  };
};

export default useFlowHelpers;
