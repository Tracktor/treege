import type { Node, NodeTypes } from "@xyflow/react";
import DefaultNode from "@/components/DataDisplay/Nodes/DefaultNode";
import { TreeNode } from "@/features/Treege/type/TreeNode";

export const nodeTypes = {
  default: DefaultNode,
  input: DefaultNode,
  output: DefaultNode,
} satisfies NodeTypes;

export type AppNode = Node<TreeNode["attributes"]>;
