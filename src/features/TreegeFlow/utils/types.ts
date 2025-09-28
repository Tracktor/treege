import type { TreeNode } from "@tracktor/types-treege";
import { Edge, Node } from "@xyflow/react";

export type NodeWithAttributes<T> = Node<
  T & {
    attributes?: {
      type?: string;
    };
  }
>;

export interface EngineLayoutOutput<T> {
  nodes: NodeWithAttributes<T>[];
  edges: Edge[];
}

export type TreeEdge = {
  uuid: string;
  source: string;
  target: string;
  type?: string;
};

export type TreeNodeData = TreeNode & Record<string, unknown>;

export interface TreeGraph {
  nodes?: TreeNode[];
  edges?: TreeEdge[];
}

export type Orientation = "vertical" | "horizontal";
