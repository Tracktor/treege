import type { TreeNode } from "@/features/Treege/type/TreeNode";

/**
 * Get a tree node by search path within the hierarchy
 * If searchPath is not provided, return the current node
 * @param node The starting element
 * @param searchPath The path to search for
 */
export const getTree = (node: TreeNode | null | undefined, searchPath?: string | null): TreeNode | null => {
  if (!node) {
    return null;
  }

  if (!searchPath) {
    return node;
  }

  // Check if the current element's treePath matches with searchPath
  if (node.attributes?.treePath === searchPath) {
    return node.attributes?.tree || null;
  }

  // Recursively search in child elements
  let result: TreeNode | null = null;
  const hasTree = node.attributes?.tree;
  const hasChildren = node.children?.length;

  if (hasTree) {
    result = getTree(node.attributes?.tree, searchPath);
  }

  if (hasChildren) {
    const { children } = node;
    for (let i = 0; i < children.length; i += 1) {
      const child = children[i];
      // If result is found, return it.
      if (result !== null) {
        return result;
      }
      result = getTree(child, searchPath);
    }
  }

  return result;
};

export default getTree;
