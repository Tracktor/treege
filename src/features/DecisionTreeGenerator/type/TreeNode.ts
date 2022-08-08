import type { HierarchyPointNode } from "d3-hierarchy";
import type { CustomNodeElementProps, RawNodeDatum } from "react-d3-tree/lib/types/common";

export interface TreeNodeField {
  depth: number;
  disabled?: boolean;
  isDecisionField?: boolean;
  isLeaf?: boolean;
  isRoot?: boolean;
  label: string;
  paths: string[];
  required?: boolean;
  step?: string;
  type: string;
  value?: never;
}

export interface TreeNodeValues {
  depth: number;
  disabled?: never;
  isDecisionField?: never;
  isLeaf?: boolean;
  isRoot?: never;
  label: string;
  paths: string[];
  required?: never;
  step?: never;
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
