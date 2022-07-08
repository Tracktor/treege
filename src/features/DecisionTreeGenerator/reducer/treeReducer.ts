import { appendProps } from "find-and";
import type { RawNodeDatum } from "react-d3-tree/lib/types/common";

export const treeReducerActionType = {
  appendTreeCard: "appendTreeCard",
};

export const appendTreeCard = (name: string, children: RawNodeDatum[]) => ({
  children,
  name,
  type: treeReducerActionType.appendTreeCard,
});

const treeReducer = (state: any, action: any) => {
  switch (action.type) {
    case treeReducerActionType.appendTreeCard:
      return appendProps(state, { name: action.name }, { children: action.children });
    default:
      throw new Error();
  }
};

export default treeReducer;
