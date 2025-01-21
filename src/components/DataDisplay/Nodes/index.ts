import type { Node, NodeTypes } from "@xyflow/react";
import DefaultNode from "@/features/Treege/components/Nodes/DefaultNode";
import { TreeNodeAttributes } from "@/features/Treege/type/TreeNode";

export const nodeTypes = {
  default: DefaultNode,
  input: DefaultNode,
  output: DefaultNode,
} satisfies NodeTypes;

export type AppNode = Node<TreeNodeAttributes>;
