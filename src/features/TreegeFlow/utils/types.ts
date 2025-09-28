import type { TreeNode } from "@tracktor/types-treege";

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
