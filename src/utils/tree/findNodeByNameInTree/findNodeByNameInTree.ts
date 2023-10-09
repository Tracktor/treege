import type { TreeNode } from "@/features/Treege/type/TreeNode";

/**
 * Get node by name in current tree
 * @param node
 * @param name
 */
const findNodeByNameInTree = (node: TreeNode | null, name: string): TreeNode | null => {
  if (!node) {
    return null;
  }

  if (node.name === name) {
    return node;
  }

  const children = node.children || [];
  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    const result = findNodeByNameInTree(child, name);

    if (result) {
      return result;
    }
  }

  return null;
};

export default findNodeByNameInTree;
