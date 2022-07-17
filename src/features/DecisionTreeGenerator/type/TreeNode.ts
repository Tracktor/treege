import type { HierarchyPointNode } from "d3-hierarchy";
import type { CustomNodeElementProps, RawNodeDatum } from "react-d3-tree/lib/types/common";

export interface TreeNodeField {
  depth: number;
  disabled: boolean;
  isLeaf?: boolean;
  isRoot?: boolean;
  label?: never;
  paths: string[];
  required: boolean;
  type: string;
  value?: never;
}

export interface TreeNodeValues {
  depth: number;
  disabled?: never;
  isLeaf?: boolean;
  isRoot?: never;
  label: string;
  paths: string[];
  required?: never;
  type?: never;
  value: string;
}

export type TreeNodeAttributes = TreeNodeField | TreeNodeValues;

export interface TreeNode extends Omit<RawNodeDatum, "attributes" | "children"> {
  name: string;
  attributes: TreeNodeAttributes;
  children: TreeNode[];
}

export interface TreeCustomNodeElementProps extends Omit<CustomNodeElementProps, "hierarchyPointNode"> {
  hierarchyPointNode: HierarchyPointNode<TreeNode>;
}

export type TreeRenderCustomNodeElementFn = (rd3tNodeProps: TreeCustomNodeElementProps) => JSX.Element;
