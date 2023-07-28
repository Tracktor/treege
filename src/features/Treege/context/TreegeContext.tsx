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
  /**
   * CurrentHierarchyPointNode is the current node selected
   */
  currentHierarchyPointNode: null | HierarchyPointNode<TreeNode>;
  /**
   * This is the modal open state
   */
  modalOpen: ModalType;
  /**
   * This is the function to set the current node selected
   * @param state
   */
  /**
   * This is the tree modal open state
   */
  treeModalOpen: boolean;
  treePath: TreePath[] | [];
  /**
   * This is the tree node object
   */
  tree: null | TreeNode;
  /**
   * This is endpoint of the API
   */
  endPoint?: string;
  /**
   * This is the version of Treege
   */
  version: string;
  /**
   * This is the current tree information
   * This is not the node to display tree
   */
  currentTree: CurrentTree;
  /**
   * This is the tree node dispatch function
   * @param state
   */
  dispatchTree(state: ReducerAction<any>): void;

  /**
   * This is the function to set the modal open state
   * @param state
   */
  setCurrentHierarchyPointNode(state: SetStateAction<null | HierarchyPointNode<TreeNode>>): void;

  /**
   * This is the function to set the modal open state
   * @param state
   */
  setModalOpen(state: SetStateAction<ModalType>): void;
  /**
   * This is the function to set the modal open state
   * @param state
   */
  setTreeModalOpen(state: SetStateAction<boolean>): void;
  /**
   * This is the function to set the tree path
   * @param state
   */
  setTreePath(state: SetStateAction<TreePath[] | []>): void;
  /**
   * This is the function to set the current tree information
   * Not the node to display tree
   * @param state
   */
  setCurrentTree(state: SetStateAction<CurrentTree>): void;
}

export const treeDefaultValue: TreeDefaultValue = {
  currentHierarchyPointNode: null,
  currentTree: { errorName: "", id: "", name: "" },
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
  version: "",
};

export const TreegeContext = createContext(treeDefaultValue);
