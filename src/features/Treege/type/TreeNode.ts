import type { HierarchyPointNode } from "d3-hierarchy";
import type { CustomNodeElementProps } from "react-d3-tree/lib/types/types/common";
import type fields from "@/constants/fields";

export interface TreeValues {
  id: string;
  label: string;
  value: string;
  message?: string;
}

export interface Params {
  id: string;
  key: string;
  value: string;
}

export interface PathKey {
  object?: string;
  value?: string;
  label?: string;
  image?: string;
}

export interface Route {
  url: string;
  searchKey?: string;
  pathKey?: PathKey;
  params?: Params[];
}

export interface TreeNode {
  uuid: string;
  attributes:
    | {
        depth: number;
        tag?: string;
        helperText?: string;
        isDecision?: boolean;
        isLeaf?: boolean;
        isRoot?: boolean;
        label?: string;
        name: string;
        required?: boolean;
        step?: string;
        type: (typeof fields)[number]["type"];
        value?: never;
        values?: TreeValues[];
        message?: never;
        tree?: TreeNode;
        treePath?: string;
        repeatable?: boolean;
        hiddenValue?: string;
        isDisabledPast?: boolean;
        route?: Route;
        parentRef?: string;
        initialQuery?: boolean;
        pattern?: string;
        patternMessage?: string;
        messages?: {
          on?: string;
          off?: string;
        };
      }
    | {
        depth: number;
        tag?: string;
        helperText?: string;
        messages?: never;
        isDecision?: never;
        isLeaf?: boolean;
        isRoot?: never;
        label?: string;
        name: string;
        required?: never;
        step?: never;
        type?: never;
        value: string;
        values?: never;
        message?: string;
        tree?: never;
        treePath?: never;
        repeatable?: never;
        hiddenValue?: never;
        isDisabledPast?: boolean;
        route?: Route;
        parentRef?: string;
        initialQuery?: boolean;
        pattern?: string;
        patternMessage?: string;
      };
  children: TreeNode[];
  treeId?: string;
}

export interface TreeNodeField {
  depth: number;
  helperText?: string;
  messages?: {
    on?: string;
    off?: string;
  };
  isDecision?: boolean;
  isLeaf?: boolean;
  isRoot?: boolean;
  label?: string;
  name?: string;
  required?: boolean;
  step?: string;
  type: (typeof fields)[number]["type"];
  value?: never;
  values?: TreeValues[];
  message?: never;
  tree?: TreeNode;
  treePath?: string;
  repeatable?: boolean;
  hiddenValue?: string;
}

export interface TreeCustomNodeElementProps extends Omit<CustomNodeElementProps, "hierarchyPointNode"> {
  hierarchyPointNode: HierarchyPointNode<TreeNode>;
}

export type TreeRenderCustomNodeElementFn = (rd3tNodeProps: TreeCustomNodeElementProps) => JSX.Element;
