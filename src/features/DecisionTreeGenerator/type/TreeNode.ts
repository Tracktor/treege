import type { HierarchyPointNode } from "d3-hierarchy";
import type { CustomNodeElementProps, RawNodeDatum } from "react-d3-tree/lib/types/common";

export interface TreeNodeField {
  depth: number;
  helperText?: string;
  trueMessage?: string;
  falseMessage?: string;
  isDecision?: boolean;
  isLeaf?: boolean;
  isRoot?: boolean;
  label: string;
  required?: boolean;
  step?: string;
  type: string;
  value?: never;
  values?: { id: string; label: string; value: string; message?: string }[];
  message?: never;
}

export interface TreeNodeValues {
  depth: number;
  helperText?: string;
  trueMessage?: string;
  falseMessage?: string;
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
