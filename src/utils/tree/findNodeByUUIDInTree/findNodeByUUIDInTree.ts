import type { TreeNode } from "@tracktor/types-treege";

/**
 * Get node by uuid in current tree
 * @param node
 * @param uuid
 */
const findNodeByUUIDInTree = (node: TreeNode | null, uuid: string): TreeNode | null => {
  if (!node) {
    return null;
  }

  if (node.uuid === uuid) {
    return node;
  }

  const children = node.children || [];
  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    const result = findNodeByUUIDInTree(child, uuid);

    if (result) {
      return result;
    }
  }

  return null;
};

export default findNodeByUUIDInTree;
