import type { HierarchyPointNode } from "d3-hierarchy";
import { createContext, Dispatch, ReducerAction, SetStateAction } from "react";
import type { TreeNodeDatum } from "react-d3-tree/lib/types/common";
import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

export interface TreeDefaultValue {
  currentHierarchyPointNode: null | HierarchyPointNode<TreeNodeDatum>;
  dispatchTree: Dispatch<ReducerAction<any>>;
  modalOpen: "add" | "edit" | "delete" | null;
  setCurrentHierarchyPointNode: Dispatch<SetStateAction<null | HierarchyPointNode<TreeNodeDatum>>>;
  setModalOpen: Dispatch<SetStateAction<"add" | "edit" | "delete" | null>>;
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
      required: false,
      type: "text",
    },
    children: [
      {
        attributes: {
          depth: 1,
          label: "Age",
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
