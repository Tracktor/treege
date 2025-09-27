import type { TreeNode } from "@tracktor/types-treege";
import { appendNode, removeNode, updateNodeInTree } from "@/utils/tree";

export const treeReducerActionType = {
  appendTreeCard: "appendTreeCard",
  deleteTreeCard: "deleteTreeCard",
  replaceTreeCard: "replaceTreeCard",
  resetTree: "resetTree",
  setTree: "setTree",
} as const;

export type TreeReducerAction =
  | { type: typeof treeReducerActionType.appendTreeCard; path: string | null; uuid: string; children: TreeNode }
  | { type: typeof treeReducerActionType.deleteTreeCard; path: string | ""; uuid: string }
  | { type: typeof treeReducerActionType.replaceTreeCard; path: string | null; uuid: string; children: TreeNode }
  | { type: typeof treeReducerActionType.resetTree }
  | { type: typeof treeReducerActionType.setTree; tree: TreeNode | null };

export const appendTreeCard = (path: string | null, uuid: string, children: TreeNode): TreeReducerAction => ({
  children,
  path,
  type: treeReducerActionType.appendTreeCard,
  uuid,
});

export const replaceTreeCard = (path: string | null, uuid: string, children: TreeNode): TreeReducerAction => ({
  children,
  path,
  type: treeReducerActionType.replaceTreeCard,
  uuid,
});

export const deleteTreeCard = (path: string | "", uuid: string): TreeReducerAction => ({
  path,
  type: treeReducerActionType.deleteTreeCard,
  uuid,
});

export const resetTree = (): TreeReducerAction => ({
  type: treeReducerActionType.resetTree,
});

export const setTree = (tree: TreeNode | null): TreeReducerAction => ({
  tree,
  type: treeReducerActionType.setTree,
});

const treeReducer = (tree: TreeNode | null, action: any) => {
  switch (action.type) {
    case treeReducerActionType.appendTreeCard: {
      const { uuid, path, children } = action;

      return appendNode({
        child: children,
        path,
        tree,
        uuid,
      });
    }

    case treeReducerActionType.deleteTreeCard: {
      const { path, uuid } = action;

      return removeNode({ path, tree, uuid });
    }

    case treeReducerActionType.replaceTreeCard: {
      const { uuid, path, children } = action;

      return updateNodeInTree({
        children,
        path,
        tree,
        uuid,
      });
    }

    case treeReducerActionType.resetTree: {
      return null;
    }

    case treeReducerActionType.setTree: {
      return action.tree;
    }

    default:
      throw new Error();
  }
};

export default treeReducer;
