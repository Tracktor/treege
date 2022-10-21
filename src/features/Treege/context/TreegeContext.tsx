import type { HierarchyPointNode } from "d3-hierarchy";
import { createContext, ReducerAction, SetStateAction } from "react";
import type { TreeNode } from "@/features/Treege/type/TreeNode";

type ModalType = "add" | "edit" | "delete" | "save" | null;
type TreePath = { path: string; label: string };
type CurrentTree = {
  id?: string;
  name?: string;
  errorName?: string;
};

export interface TreeDefaultValue {
  currentHierarchyPointNode: null | HierarchyPointNode<TreeNode>;
  dispatchTree(state: ReducerAction<any>): void;
  modalOpen: ModalType;
  setCurrentHierarchyPointNode(state: SetStateAction<null | HierarchyPointNode<TreeNode>>): void;
  setModalOpen(state: SetStateAction<ModalType>): void;
  setTreeModalOpen(state: SetStateAction<boolean>): void;
  setTreePath(state: SetStateAction<TreePath[] | []>): void;
  setCurrentTree(state: SetStateAction<CurrentTree>): void;
  treeModalOpen: boolean;
  treePath: TreePath[] | [];
  tree: null | TreeNode;
  endPoint?: string;
  version?: string;
  currentTree: CurrentTree;
}

export const treeDefaultValue = {
  currentHierarchyPointNode: null,
  currentTree: { errorName: "", name: "" },
  dispatchTree: () => null,
  endPoint: undefined,
  modalOpen: null,
  setCurrentHierarchyPointNode: () => null,
  setCurrentTree: () => null,
  setModalOpen: () => null,
  setTreeModalOpen: () => null,
  setTreePath: () => null,
  tree: null,
  treeModalOpen: false,
  treePath: [],
  version: undefined,
};

export const TreegeContext = createContext<TreeDefaultValue>(treeDefaultValue);
