import type { Node, NodeTypes } from "@xyflow/react";
import DefaultNodeComponent from "@/components/DataDisplay/Nodes/DefaultNode";
import { TreeNode } from "@/features/Treege/type/TreeNode";

export const nodeTypes = {
  default: DefaultNodeComponent,
} satisfies NodeTypes;

export type AppNode = Node<TreeNode["attributes"]>;
