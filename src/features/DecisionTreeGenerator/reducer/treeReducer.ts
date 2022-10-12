import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";
import { appendNode, removeNode, updatedNode } from "@/utils/tree";

export const treeReducerActionType = {
  appendTreeCard: "appendTreeCard",
  deleteTreeCard: "deleteTreeCard",
  replaceTreeCard: "replaceTreeCard",
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

      return updatedNode({
        child: children,
        name,
        path,
        tree,
      });
    }

    default:
      throw new Error();
  }
};

export default treeReducer;
