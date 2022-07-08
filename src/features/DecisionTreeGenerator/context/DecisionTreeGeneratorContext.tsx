import { createContext, Dispatch } from "react";
import type { RawNodeDatum } from "react-d3-tree/lib/types/common";

export interface TreeDefaultValue {
  dispatch: Dispatch<any>;
  tree: RawNodeDatum | undefined;
}

export const treeDefaultValue: TreeDefaultValue = {
  dispatch: () => null,
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
