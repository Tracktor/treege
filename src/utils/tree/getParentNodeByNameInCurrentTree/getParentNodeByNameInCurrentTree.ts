import type { TreeNode } from "@/features/Treege/type/TreeNode";

const getParentNodeByNameInCurrentTree = (tree: TreeNode | null, name: string, parentNode: TreeNode | null = null): TreeNode | null => {
  if (!tree) return null;

  let result = null;
  const hasName = tree?.name === name;
  const hasChildren = tree?.children?.length;

  if (hasName) {
    return parentNode;
  }

  if (hasChildren) {
    tree.children.some((item) => {
      result = getParentNodeByNameInCurrentTree(item, name, tree);
      return !!result;
    });
  }

  return result;
};

export default getParentNodeByNameInCurrentTree;
