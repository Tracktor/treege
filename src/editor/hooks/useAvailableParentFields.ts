import { useReactFlow } from "@xyflow/react";
import { useMemo } from "react";
import { InputNodeData, TreegeNode } from "@/shared/types/node";
import { isInputNode } from "@/shared/utils/nodeTypeGuards";

/**
 * Hook to get all available parent input fields for a given node.
 * Returns input nodes that are ancestors of the current node.
 *
 * @param currentNodeId - The ID of the current node
 * @returns Array of available parent fields with their metadata
 */
export const useAvailableParentFields = (currentNodeId?: string) => {
  const { getNodes, getEdges } = useReactFlow();

  return useMemo(() => {
    if (!currentNodeId) {
      return [];
    }

    const nodes = getNodes() as TreegeNode[];
    const edges = getEdges();

    /**
     * Recursively find all ancestor nodes
     */
    const findAncestors = (nodeId: string, visited = new Set<string>()): string[] => {
      if (visited.has(nodeId)) {
        return [];
      }

      const newVisited = new Set(visited).add(nodeId);
      const incomingEdges = edges.filter((edge) => edge.target === nodeId);

      return incomingEdges.flatMap((edge) => [edge.source, ...findAncestors(edge.source, newVisited)]);
    };

    const ancestorIds = findAncestors(currentNodeId);

    // Filter for input nodes only and map to useful metadata
    return nodes
      .filter((node) => {
        const isAncestor = ancestorIds.includes(node.id);
        return isAncestor && isInputNode(node);
      })
      .map((node) => {
        const data = node.data as InputNodeData;
        const label = (typeof data.label === "object" ? data.label.en : data.label) || `Node ${node.id.slice(0, 8)}`;

        return {
          label: data.name ? `${label} (${data.name})` : label,
          name: data.name,
          nodeId: node.id,
          type: data.type || "text",
        };
      });
  }, [currentNodeId, getNodes, getEdges]);
};
