import { createContext, Dispatch, SetStateAction } from "react";
import type { RawNodeDatum } from "react-d3-tree/lib/types/common";

export interface DecisionTreeGeneratorContextProviderDefaultValue {
  tree: RawNodeDatum | undefined;
  setTree: Dispatch<SetStateAction<RawNodeDatum>>;
}

export const DecisionTreeGeneratorContextDefaultValue: DecisionTreeGeneratorContextProviderDefaultValue = {
  setTree: () => null,
  tree: {
    attributes: {
      type: "select",
    },
    children: [],
    name: "A",
  },
};

export const DecisionTreeGeneratorContext = createContext(DecisionTreeGeneratorContextDefaultValue);
