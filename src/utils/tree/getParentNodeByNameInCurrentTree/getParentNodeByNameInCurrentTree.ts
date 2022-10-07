import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

const getParentNodeByNameInCurrentTree = (tree: TreeNode | null, name: string, parentNode: TreeNode | null = null): TreeNode | null => {
  if (!tree) return null;

  let result = null;
  const hasName = tree?.name === name;
  const hasChildren = tree?.children?.length;

  if (hasName) {
    return parentNode;
  }

  if (hasChildren) {
    for (let i = 0; result === null && i < tree.children.length; i++) {
      result = getParentNodeByNameInCurrentTree(tree.children[i], name, tree);
    }
  }

  return result;
};

export default getParentNodeByNameInCurrentTree;
