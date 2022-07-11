import { appendProps, removeObject, replaceObject, returnFound } from "find-and";
import type { TreeRawNodeDatum } from "@/features/DecisionTreeGenerator/type/TreeRawNodeDatum";

export const treeReducerActionType = {
  appendTreeCard: "appendTreeCard",
  removeTreeCard: "removeTreeCard",
  replaceTreeCard: "replaceTreeCard",
} as const;

export const appendTreeCard = (name: string, children: TreeRawNodeDatum) => ({
  children,
  name,
  type: treeReducerActionType.appendTreeCard,
});

export const removeTreeCard = (name: string) => ({
  name,
  type: treeReducerActionType.removeTreeCard,
});

export const replaceTreeCard = (name: string, children: TreeRawNodeDatum) => ({
  children,
  name,
  type: treeReducerActionType.replaceTreeCard,
});

const treeReducer = (state: any, action: any) => {
  switch (action.type) {
    case treeReducerActionType.appendTreeCard:
      return appendProps(
        state,
        { name: action.name },
        { children: [...(returnFound(state, { name: action.name })?.children || []), action.children] }
      );
    case treeReducerActionType.removeTreeCard:
      return removeObject(state, { name: action.name });
    case treeReducerActionType.replaceTreeCard:
      return replaceObject(state, { name: action.name }, action.children);
    default:
      throw new Error();
  }
};

export default treeReducer;
