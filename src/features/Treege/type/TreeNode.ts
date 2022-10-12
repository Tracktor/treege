import type { HierarchyPointNode } from "d3-hierarchy";
import type { CustomNodeElementProps, RawNodeDatum } from "react-d3-tree/lib/types/common";
import type fields from "@/constants/fields";

export interface TreeValues {
  id: string;
  label: string;
  value: string;
  message?: string;
}

export interface TreeNodeField {
  depth: number;
  helperText?: string;
  messages?: { on?: string; off?: string };
  isDecision?: boolean;
  isLeaf?: boolean;
  isRoot?: boolean;
  label: string;
  required?: boolean;
  step?: string;
  type: typeof fields[number]["type"];
  value?: never;
  values?: TreeValues[];
  message?: never;
  tree?: TreeNode;
  treePath?: string;
}

export interface TreeNodeValues {
  depth: number;
  helperText?: string;
  messages?: never;
  isDecision?: never;
  isLeaf?: boolean;
  isRoot?: never;
  label: string;
  required?: never;
  step?: never;
  type?: never;
  value: string;
  values?: never;
  message?: string;
  tree?: never;
  treePath?: never;
}

export type TreeNodeAttributes = TreeNodeField | TreeNodeValues;

export interface TreeNode extends Omit<RawNodeDatum, "attributes" | "children"> {
  name: string;
  attributes: TreeNodeAttributes;
  children: TreeNode[];
  treeId?: string;
}

export interface TreeCustomNodeElementProps extends Omit<CustomNodeElementProps, "hierarchyPointNode"> {
  hierarchyPointNode: HierarchyPointNode<TreeNode>;
}

export type TreeRenderCustomNodeElementFn = (rd3tNodeProps: TreeCustomNodeElementProps) => JSX.Element;