import type { TreeNode } from "@tracktor/types-treege";

/**
 * Get all ancestor names from tree
 * @param tree
 * @param uuid
 */
const getAllAncestorNamesFromTree = (tree: TreeNode | null, uuid: string | undefined): string[] => {
  if (!tree) {
    return [];
  }

  const names: string[] = [];

  const extractNodeNames = (node: TreeNode) => {
    if (node.attributes?.name) {
      names.push(node?.attributes?.name);
    }

    if (node?.uuid === uuid) {
      return;
    }

    if (node.children.length) {
      const { children } = node;

      for (let i = 0; i < children.length; i += 1) {
        extractNodeNames(children[i]);
      }
    }
  };

  extractNodeNames(tree);

  return [...new Set(names)];
};

export default getAllAncestorNamesFromTree;
