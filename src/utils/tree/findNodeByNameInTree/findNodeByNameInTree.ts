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

  for (const child of node.children || []) {
    const result = findNodeByNameInTree(child, name);

    if (result) {
      return result;
    }
  }

  return null;
};

export default findNodeByNameInTree;
