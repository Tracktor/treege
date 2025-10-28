import { useNodes } from "@xyflow/react";
import { useMemo } from "react";
import { TreegeNode, TreegeNodeData } from "@/shared/types/node";
import { isGroupNode } from "@/shared/utils/nodeTypeGuards";

/**
 * Hook to access flow nodes selection state and derived data.
 * Only re-renders when selection or nodes change.
 * @template TNodeData - The specific node data type to use for selectedNode
 */
const useNodesSelection = <TNodeData extends TreegeNodeData = TreegeNodeData>() => {
  const nodes = useNodes<TreegeNode>();
  const groupNodes = useMemo(() => nodes.filter(isGroupNode), [nodes]);
  const selectedNodes = useMemo(() => nodes.filter((node) => node.selected), [nodes]);
  const selectedNode = useMemo(() => nodes.find((node) => node.selected) as (TreegeNode & { data: TNodeData }) | undefined, [nodes]);

  return {
    groupNodes,
    hasSelectedNodes: selectedNodes.length > 0,
    nodes,
    selectedNode,
    selectedNodes,
  };
};

export default useNodesSelection;
