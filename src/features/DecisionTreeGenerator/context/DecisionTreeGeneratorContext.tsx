import type { HierarchyPointNode } from "d3-hierarchy";
import { createContext, ReducerAction, SetStateAction } from "react";
import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

export interface TreeDefaultValue {
  currentHierarchyPointNode: null | HierarchyPointNode<TreeNode>;
  dispatchTree(state: ReducerAction<any>): void;
  modalOpen: "add" | "edit" | "delete" | null;
  setCurrentHierarchyPointNode(state: SetStateAction<null | HierarchyPointNode<TreeNode>>): void;
  setModalOpen(state: SetStateAction<"add" | "edit" | "delete" | null>): void;
  tree: null | TreeNode;
}

export const treeDefaultValue: TreeDefaultValue = {
  currentHierarchyPointNode: null,
  dispatchTree: () => null,
  modalOpen: null,
  setCurrentHierarchyPointNode: () => null,
  setModalOpen: () => null,
  tree: null,
};

export const DecisionTreeGeneratorContext = createContext(treeDefaultValue);
