import type { TreeNode } from "@/features/Treege/type/TreeNode";
import { appendNode, removeNode, updateNodeInTree } from "@/utils/tree";

export const treeReducerActionType = {
  appendTreeCard: "appendTreeCard",
  deleteTreeCard: "deleteTreeCard",
  replaceTreeCard: "replaceTreeCard",
  resetTree: "resetTree",
  setTree: "setTree",
} as const;

export const appendTreeCard = (path: string | null, name: string, children: TreeNode) => ({
  children,
  name,
  path,
  type: treeReducerActionType.appendTreeCard,
});

export const replaceTreeCard = (path: string | null, name: string, children: TreeNode) => ({
  children,
  name,
  path,
  type: treeReducerActionType.replaceTreeCard,
});

export const deleteTreeCard = (path: string | "", name: string) => ({
  name,
  path,
  type: treeReducerActionType.deleteTreeCard,
});

export const resetTree = () => ({
  type: treeReducerActionType.resetTree,
});

export const setTree = (tree: TreeNode) => ({
  tree,
  type: treeReducerActionType.setTree,
});

const treeReducer = (tree: TreeNode, action: any) => {
  switch (action.type) {
    case treeReducerActionType.appendTreeCard: {
      const { name, path, children } = action;

      return appendNode({
        child: children,
        name,
        path,
        tree,
      });
    }

    case treeReducerActionType.deleteTreeCard: {
      const { path, name } = action;

      return removeNode({ name, path, tree });
    }

    case treeReducerActionType.replaceTreeCard: {
      const { name, path, children } = action;

      return updateNodeInTree({
        child: children,
        name,
        path,
        tree,
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
