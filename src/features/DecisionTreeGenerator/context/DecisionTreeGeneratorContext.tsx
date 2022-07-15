import type { HierarchyPointNode } from "d3-hierarchy";
import { createContext, ReducerAction, SetStateAction } from "react";
import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

export interface TreeDefaultValue {
  currentHierarchyPointNode: null | HierarchyPointNode<TreeNode>;
  dispatchTree(state: ReducerAction<any>): void;
  modalOpen: "add" | "edit" | "delete" | null;
  setCurrentHierarchyPointNode(state: SetStateAction<null | HierarchyPointNode<TreeNode>>): void;
  setModalOpen(state: SetStateAction<"add" | "edit" | "delete" | null>): void;
  tree: TreeNode;
}

export const treeDefaultValue: TreeDefaultValue = {
  currentHierarchyPointNode: null,
  dispatchTree: () => null,
  modalOpen: null,
  setCurrentHierarchyPointNode: () => null,
  setModalOpen: () => null,
  tree: {
    attributes: {
      depth: 0,
      disabled: false,
      isRoot: true,
      paths: ["Age"],
      required: false,
      type: "select",
    },
    children: [
      {
        attributes: {
          depth: 1,
          label: "Age",
          paths: ["Age", "Age 20"],
          value: "20",
        },
        children: [],
        name: "Age 20",
      },
      {
        attributes: {
          depth: 1,
          label: "Age",
          paths: ["Age", "Age 30"],
          value: "30",
        },
        children: [],
        name: "Age 30",
      },
    ],
    name: "Age",
  },
};

export const DecisionTreeGeneratorContext = createContext(treeDefaultValue);
