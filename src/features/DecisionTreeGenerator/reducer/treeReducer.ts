import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";
import appendChild from "@/utils/tree/appendChild/appendChild";
import removeNode from "@/utils/tree/removeNode/removeNode";
import updatedNode from "@/utils/tree/updatedNode/updatedNode";

export const treeReducerActionType = {
  appendTreeCard: "appendTreeCard",
  deleteTreeCard: "deleteTreeCard",
  replaceTreeCard: "replaceTreeCard",
  replaceTreeCardAndKeepPrevChildren: "replaceTreeCardAndKeepPrevChildren",
  setIsLeaf: "setIsLeaf",
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

export const replaceTreeCardAndKeepPrevChildren = (name: string, children: TreeNode) => ({
  children,
  name,
  type: treeReducerActionType.replaceTreeCardAndKeepPrevChildren,
});

export const setTree = (tree: TreeNode) => ({
  tree,
  type: treeReducerActionType.setTree,
});

export const setIsLeaf = (name: string, isLeaf: boolean) => ({
  isLeaf,
  name,
  type: treeReducerActionType.setIsLeaf,
});

const treeReducer = (state: any, action: any) => {
  switch (action.type) {
    case treeReducerActionType.appendTreeCard: {
      const { name, path, children } = action;

      return appendChild({
        child: children,
        name,
        path,
        tree: state,
      });
    }

    case treeReducerActionType.deleteTreeCard: {
      const { path, name } = action;

      return removeNode({ name, path, tree: state });
    }

    case treeReducerActionType.replaceTreeCard: {
      const { name, path, children } = action;

      return updatedNode({
        child: children,
        name,
        path,
        tree: state,
      });
    }

    case treeReducerActionType.setTree: {
      const isLeaf = !action?.tree?.attributes?.isDecision;

      return {
        ...action.tree,
        attributes: {
          ...action?.tree?.attributes,
          isLeaf,
        },
      };
    }
    default:
      throw new Error();
  }
};

export default treeReducer;
