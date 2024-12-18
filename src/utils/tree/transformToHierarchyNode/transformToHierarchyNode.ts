import { NodeProps } from "@xyflow/react";
import type { AppNode } from "@/components/DataDisplay/Nodes";
import type { TreeNode } from "@/features/Treege/type/TreeNode";

export interface HierarchyPointNode<T> {
  data: T;
  depth: number;
  x: number;
  y: number;
  children?: HierarchyPointNode<T>[];
}

/**
 * Transforms a React Flow node into a HierarchyPointNode
 */
const transformToHierarchyNode = (nodeProps: NodeProps<AppNode>): HierarchyPointNode<TreeNode> => ({
  children: [],
  data: {
    attributes: nodeProps.data,
    children: [],
    uuid: nodeProps.id,
  },
  depth: nodeProps.data.depth,
  x: nodeProps.positionAbsoluteX,
  y: nodeProps.positionAbsoluteY,
});

export default transformToHierarchyNode;
