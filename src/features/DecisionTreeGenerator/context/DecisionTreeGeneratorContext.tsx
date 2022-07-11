import type { HierarchyPointNode } from "d3-hierarchy";
import { createContext, Dispatch, ReducerAction, SetStateAction } from "react";
import type { TreeNodeDatum } from "react-d3-tree/lib/types/common";
import type { TreeRawNodeDatum } from "@/features/DecisionTreeGenerator/type/TreeRawNodeDatum";

export interface TreeDefaultValue {
  currentHierarchyPointNode: null | HierarchyPointNode<TreeNodeDatum>;
  dispatchTree: Dispatch<ReducerAction<any>>;
  modalIsOpen: boolean;
  setCurrentHierarchyPointNode: Dispatch<SetStateAction<null | HierarchyPointNode<TreeNodeDatum>>>;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
  tree: TreeRawNodeDatum;
}

export const treeDefaultValue: TreeDefaultValue = {
  currentHierarchyPointNode: null,
  dispatchTree: () => null,
  modalIsOpen: false,
  setCurrentHierarchyPointNode: () => null,
  setModalIsOpen: () => null,
  tree: {
    attributes: {
      depth: 0,
      disable: false,
      required: false,
      type: "text",
    },
    children: [],
    name: "Champs de texte",
  },
};

export const DecisionTreeGeneratorContext = createContext(treeDefaultValue);
