import type { HierarchyPointNode } from "d3-hierarchy";
import { createContext, ReducerAction, SetStateAction } from "react";
import type { TreeNode } from "@/features/Treege/type/TreeNode";

type ModalType = "add" | "edit" | "delete" | null;
type TreePath = { path: string; label: string };

export interface TreeDefaultValue {
  currentHierarchyPointNode: null | HierarchyPointNode<TreeNode>;
  dispatchTree(state: ReducerAction<any>): void;
  modalOpen: ModalType;
  setCurrentHierarchyPointNode(state: SetStateAction<null | HierarchyPointNode<TreeNode>>): void;
  setModalOpen(state: SetStateAction<ModalType>): void;
  setTreeModalOpen(state: SetStateAction<boolean>): void;
  setTreePath(state: SetStateAction<TreePath[] | []>): void;
  treeModalOpen: boolean;
  treePath: TreePath[] | [];
  tree: null | TreeNode;
  endPoint: null | string;
}

export const treeDefaultValue: TreeDefaultValue = {
  currentHierarchyPointNode: null,
  dispatchTree: () => null,
  endPoint: null,
  modalOpen: null,
  setCurrentHierarchyPointNode: () => null,
  setModalOpen: () => null,
  setTreeModalOpen: () => null,
  setTreePath: () => null,
  tree: null,
  treeModalOpen: false,
  treePath: [],
};

export const TreegeContext = createContext(treeDefaultValue);
