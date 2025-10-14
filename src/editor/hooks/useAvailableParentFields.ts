import { useEdges, useNodes } from "@xyflow/react";
import { useMemo } from "react";
import { InputNodeData, TreegeNode } from "@/shared/types/node";
import { isInputNode } from "@/shared/utils/nodeTypeGuards";

export const useAvailableParentFields = (currentNodeId?: string) => {
  const nodes = useNodes() as TreegeNode[];
  const edges = useEdges();

  return useMemo(() => {
    if (!currentNodeId) {
      return [];
    }

    const findAncestors = (nodeId: string, visited = new Set<string>()): string[] => {
      if (visited.has(nodeId)) {
        return [];
      }

      const newVisited = new Set(visited).add(nodeId);
      const incomingEdges = edges.filter((edge) => edge.target === nodeId);

      return incomingEdges.flatMap((edge) => [edge.source, ...findAncestors(edge.source, newVisited)]);
    };

    const ancestorIds = findAncestors(currentNodeId);

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
  }, [currentNodeId, nodes, edges]);
};

export default useAvailableParentFields;
