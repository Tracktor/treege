import { appendProps, changeProps, removeObject, replaceObject, returnFound } from "find-and";
import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";
import removeObjectProperty from "@/utils/removeObjectProperty";

export const treeReducerActionType = {
  appendTreeCard: "appendTreeCard",
  deleteTreeCard: "deleteTreeCard",
  replaceTreeCard: "replaceTreeCard",
  replaceTreeCardAndKeepPrevChildren: "replaceTreeCardAndKeepPrevChildren",
  setIsLeaf: "setIsLeaf",
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
      const isLeaf = !action.children.attributes.isDecisionField;

      return appendProps(
        state,
        { name: action.name },
        {
          children: [
            {
              ...action.children,
              attributes: {
                ...action.children.attributes,
                isLeaf,
              },
            },
          ],
        }
      );
    }

    case treeReducerActionType.deleteTreeCard: {
      return removeObject(state, { name: action.name });
    }

    case treeReducerActionType.replaceTreeCard: {
      return replaceObject(state, { name: action.name }, action.children);
    }

    case treeReducerActionType.replaceTreeCardAndKeepPrevChildren: {
      const children = returnFound(state, { name: action.name }).children.filter(({ attributes }: TreeNode) => !attributes.value);
      const isLeaf = children?.length === 0;

      return replaceObject(
        state,
        { name: action.name },
        {
          ...action.children,
          attributes: {
            ...action.children.attributes,
            isLeaf,
          },
          children,
        }
      );
    }

    case treeReducerActionType.setIsLeaf: {
      return changeProps(
        state,
        { name: action.name },
        {
          attributes: {
            ...removeObjectProperty(returnFound(state, { name: action.name }).attributes, "isLeaf"),
            ...(action.isLeaf && { isLeaf: true }),
          },
        }
      );
    }

    case treeReducerActionType.setTree: {
      const isLeaf = !action.tree.attributes.isDecisionField;

      return {
        ...action.tree,
        attributes: {
          ...action.tree.attributes,
          isLeaf,
        },
      };
    }
    default:
      throw new Error();
  }
};

export default treeReducer;
