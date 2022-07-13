import type { RawNodeDatum } from "react-d3-tree/lib/types/common";

export interface TreeNodeField {
  depth: number;
  disabled: boolean;
  isLeaf?: never;
  isRoot?: boolean;
  label?: never;
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
