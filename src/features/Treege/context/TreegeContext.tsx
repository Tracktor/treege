import type { HierarchyPointNode } from "d3-hierarchy";
import { createContext, ReducerAction, SetStateAction } from "react";
import { BackendConfig } from "@/features/Treege/Treege";
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
   * This is the backend configuration
   */
  backendConfig?: BackendConfig;
  /**
   * CurrentHierarchyPointNode is the current node selected
   */
  currentHierarchyPointNode: null | HierarchyPointNode<TreeNode>;
  /**
   * This is the current tree information
   * {
   *     "id": "treeId",
   *     "name": "Tree name"
   * }
   */
  currentTree: CurrentTree;
  /**
   * This is the tree node object
   */
  tree: null | TreeNode;
  /**
   * This is the tree modal open state
   */
  treeModalOpen: boolean;
  /**
   * This is the tree path
   * [
   *     {
   *         "label": "Tree name",
   *         "path": "uuid"
   *     }
   * ]
   */
  treePath: TreePath[] | [];
  /**
   * This is the modal open state
   */
  modalOpen: ModalType;
  /**
   * This is the version of Treege
   */
  version: string;
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
   * This is the function to set the current tree information
   * Not the node to display tree
   * @param state
   */
  setCurrentTree(state: SetStateAction<CurrentTree>): void;
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
}

export const treeDefaultValue: TreeDefaultValue = {
  backendConfig: {
    baseUrl: "",
    endpoints: {
      workflow: "/v1/workflow",
      workflows: "/v1/workflows",
    },
  },
  currentHierarchyPointNode: null,
  currentTree: {
    errorName: "",
    id: "",
    name: "",
  },
  dispatchTree: () => null,
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
