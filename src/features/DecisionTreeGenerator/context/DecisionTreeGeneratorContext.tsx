import type { HierarchyPointNode } from "d3-hierarchy";
import { createContext, Dispatch, ReducerAction, SetStateAction } from "react";
import type { TreeNodeDatum } from "react-d3-tree/lib/types/common";
import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

export interface TreeDefaultValue {
  currentHierarchyPointNode: null | HierarchyPointNode<TreeNodeDatum>;
  dispatchTree: Dispatch<ReducerAction<any>>;
  modalDeleteIsOpen: boolean;
  modalMutationIsOpen: boolean;
  setCurrentHierarchyPointNode: Dispatch<SetStateAction<null | HierarchyPointNode<TreeNodeDatum>>>;
  setModalMutationIsOpen: Dispatch<SetStateAction<boolean>>;
  setModalDeleteIsOpen: Dispatch<SetStateAction<boolean>>;
  tree: TreeNode;
}

export const treeDefaultValue: TreeDefaultValue = {
  currentHierarchyPointNode: null,
  dispatchTree: () => null,
  modalDeleteIsOpen: false,
  modalMutationIsOpen: false,
  setCurrentHierarchyPointNode: () => null,
  setModalDeleteIsOpen: () => null,
  setModalMutationIsOpen: () => null,
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
          label: "label",
          value: "value",
        },
        children: [],
        name: "ccc",
      },
    ],
    name: "Champs de texte",
  },
};

export const DecisionTreeGeneratorContext = createContext(treeDefaultValue);
