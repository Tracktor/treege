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

export const appendTreeCard = (tree: TreeNode | null, path: string | null, name: string, children: TreeNode) => ({
  children,
  name,
  path,
  tree,
  type: treeReducerActionType.appendTreeCard,
});

export const replaceTreeCard = (tree: TreeNode | null, path: string | null, name: string, children: TreeNode) => ({
  children,
  name,
  path,
  tree,
  type: treeReducerActionType.replaceTreeCard,
});

export const deleteTreeCard = (tree: TreeNode | null, path: string | "", name: string) => ({
  name,
  path,
  tree,
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
      // const isLeaf = !action.children.attributes.isDecision;
      const { name, path, children, tree } = action;

      return appendChild({
        child: children,
        name,
        path,
        tree,
      });
    }

    case treeReducerActionType.deleteTreeCard: {
      const { path, name, tree } = action;
      return removeNode(tree, path, name);
    }

    case treeReducerActionType.replaceTreeCard: {
      const { name, path, children, tree } = action;
      // return replaceObject(state, { name: action.name }, action.children);

      return updatedNode({
        child: children,
        name,
        path,
        tree,
      });
    }

    case treeReducerActionType.replaceTreeCardAndKeepPrevChildren: {
      // const children = returnFound(state, { name: action.name }).children.filter(({ attributes }: TreeNode) => !attributes.value);
      // const isLeaf = children?.length === 0;

      const { name, path, children, tree } = action;

      return updatedNode({
        child: children,
        name,
        path,
        tree,
      });

      // return replaceObject(
      //   state,
      //   { name: action.name },
      //   {
      //     ...action.children,
      //     attributes: {
      //       ...action.children.attributes,
      //       isLeaf,
      //     },
      //     children,
      //   }
      // );
    }

    case treeReducerActionType.setIsLeaf: {
      // return changeProps(
      //   state,
      //   { name: action.name },
      //   {
      //     attributes: {
      //       ...removeObjectProperty(returnFound(state, { name: action.name }).attributes, "isLeaf"),
      //       ...(action.isLeaf && { isLeaf: true }),
      //     },
      //   }
      // );
      return;
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
