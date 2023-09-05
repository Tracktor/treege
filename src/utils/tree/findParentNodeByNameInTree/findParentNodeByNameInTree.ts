import type { TreeNode } from "@/features/Treege/type/TreeNode";

/**
 * Get parent node by name in current tree
 * @param node
 * @param name
 * @param parentNode
 */
const findParentNodeByNameInTree = (node: TreeNode | null, name: string, parentNode: TreeNode | null = null): TreeNode | null => {
  if (!node) {
    return null;
  }

  if (node?.name === name) {
    return parentNode;
  }

  for (const child of node.children || []) {
    const result = findParentNodeByNameInTree(child, name, node);
    if (result !== null) {
      return result;
    }
  }

  return null;
};

export default findParentNodeByNameInTree;
