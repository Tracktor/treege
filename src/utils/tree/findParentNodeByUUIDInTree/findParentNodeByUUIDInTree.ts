import type { TreeNode } from "@/features/Treege/type/TreeNode";

/**
 * Get parent node by uuid in current tree
 * @param node
 * @param uuid
 * @param parentNode
 */
export const findParentNodeByUUIDInTree = (node: TreeNode | null, uuid: string, parentNode: TreeNode | null = null): TreeNode | null => {
  if (!node) {
    return null;
  }

  if (node.uuid === uuid) {
    return parentNode;
  }

  const children = node.children || [];

  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    const result = findParentNodeByUUIDInTree(child, uuid, node);

    if (result !== null) {
      return result;
    }
  }

  return null;
};

export default findParentNodeByUUIDInTree;
