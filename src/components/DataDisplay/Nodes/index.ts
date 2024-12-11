import type { Node, NodeTypes } from "@xyflow/react";
import DefaultNodeComponent from "@/components/DataDisplay/Nodes/DefaultNode";

type NodeData = {
  label: string;
};

export const nodeTypes = {
  default: DefaultNodeComponent,
} satisfies NodeTypes;

export type AppNode = Node<NodeData>;
