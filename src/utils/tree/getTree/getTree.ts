import type { TreeNode } from "@/features/Treege/type/TreeNode";

/**
 * Get a tree node by search path within the hierarchy
 * @param node The starting element
 * @param searchPath The path to search for
 */
const getTree = (node: TreeNode | undefined, searchPath?: string | null): TreeNode | null => {
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
  let result = null;
  const hasTree = node.attributes?.tree;
  const hasChildren = node.children?.length;

  if (hasTree) {
    result = getTree(node.attributes?.tree, searchPath);
  }

  if (hasChildren) {
    for (const child of node.children) {
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
