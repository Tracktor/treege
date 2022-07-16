import { appendProps, removeObject, replaceObject, returnFound } from "find-and";
import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

export const treeReducerActionType = {
  appendTreeCard: "appendTreeCard",
  deleteTreeCard: "deleteTreeCard",
  replaceTreeCard: "replaceTreeCard",
  setTree: "setTree",
} as const;

export const appendTreeCard = (name: string, children: TreeNode) => ({
  children,
  name,
  type: treeReducerActionType.appendTreeCard,
});

export const deleteTreeCard = (name: string) => ({
  name,
  type: treeReducerActionType.deleteTreeCard,
});

export const replaceTreeCard = (name: string, children: TreeNode) => ({
  children,
  name,
  type: treeReducerActionType.replaceTreeCard,
});

export const setTree = (tree: TreeNode) => ({
  tree,
  type: treeReducerActionType.setTree,
});

const treeReducer = (state: any, action: any) => {
  switch (action.type) {
    case treeReducerActionType.appendTreeCard:
      return appendProps(
        state,
        { name: action.name },
        { children: [...(returnFound(state, { name: action.name })?.children || []), action.children] }
      );
    case treeReducerActionType.deleteTreeCard:
      return removeObject(state, { name: action.name });
    case treeReducerActionType.replaceTreeCard:
      return replaceObject(state, { name: action.name }, action.children);
    case treeReducerActionType.setTree:
      return action.tree;
    default:
      throw new Error();
  }
};

export default treeReducer;
