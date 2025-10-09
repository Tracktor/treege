import { useNodes } from "@xyflow/react";
import { useMemo } from "react";
import { TreegeNode, TreegeNodeData } from "@/type/node";

/**
 * Hook to access flow nodes selection state and derived data.
 * Only re-renders when selection or nodes change.
 * @template TNodeData - The specific node data type to use for selectedNode
 */
const useNodesSelection = <TNodeData extends TreegeNodeData = TreegeNodeData>() => {
  const nodes = useNodes<TreegeNode>();
  const groupNodes = useMemo(() => nodes.filter((node) => node.type === "group"), [nodes]);
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
