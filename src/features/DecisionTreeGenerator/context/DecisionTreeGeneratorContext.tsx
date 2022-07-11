import { createContext, Dispatch, ReducerAction, SetStateAction } from "react";
import type { RawNodeDatum } from "react-d3-tree/lib/types/common";

export interface TreeDefaultValue {
  dispatchTree: Dispatch<ReducerAction<any>>;
  modalIsOpen: boolean;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
  tree: RawNodeDatum | undefined;
}

export const treeDefaultValue: TreeDefaultValue = {
  dispatchTree: () => null,
  modalIsOpen: false,
  setModalIsOpen: () => null,
  tree: {
    attributes: {
      depth: 0,
      disable: false,
      required: true,
      type: "",
    },
    children: [],
    name: "A",
  },
};

export const DecisionTreeGeneratorContext = createContext(treeDefaultValue);
