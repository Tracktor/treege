import type { TreeNode } from "@/features/Treege/type/TreeNode";
import appendNode from "@/utils/tree/appendNode/appendNode";
import removeNode from "@/utils/tree/removeNode/removeNode";
import updateNodeInTree from "@/utils/tree/updateNodeInTree/updateNodeInTree";

export const treeReducerActionType = {
  appendTreeCard: "appendTreeCard",
  deleteTreeCard: "deleteTreeCard",
  replaceTreeCard: "replaceTreeCard",
  resetTree: "resetTree",
  setTree: "setTree",
} as const;

export const appendTreeCard = (path: string | null, uuid: string, children: TreeNode) => ({
  children,
  path,
  type: treeReducerActionType.appendTreeCard,
  uuid,
});

export const replaceTreeCard = (path: string | null, uuid: string, children: TreeNode) => ({
  children,
  path,
  type: treeReducerActionType.replaceTreeCard,
  uuid,
});

export const deleteTreeCard = (path: string | "", uuid: string) => ({
  path,
  type: treeReducerActionType.deleteTreeCard,
  uuid,
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
