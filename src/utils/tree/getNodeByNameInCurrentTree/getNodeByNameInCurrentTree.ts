import type { TreeNode } from "@/features/Treege/type/TreeNode";

const getNodeByNameInCurrentTree = (tree: TreeNode | null, name: string): TreeNode | null => {
  if (!tree) {
    return null;
  }

  let result = null;

  const hasName = tree?.name === name;
  const hasChildren = tree?.children?.length;

  if (hasName) {
    return tree;
  }

  if (hasChildren) {
    for (let i = 0; result === null && i < tree.children.length; i += 1) {
      result = getNodeByNameInCurrentTree(tree.children[i], name);
    }
  }

  return result;
};

export default getNodeByNameInCurrentTree;
