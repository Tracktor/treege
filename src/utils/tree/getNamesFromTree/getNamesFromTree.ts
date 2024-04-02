import type { TreeNode } from "@/features/Treege/type/TreeNode";

/**
 * Get all names from tree
 * @param tree
 */
const getNamesFromTree = (tree: TreeNode | null): string[] => {
  if (!tree) {
    return [];
  }

  const names: string[] = [];

  const extractNodeNames = (node: TreeNode) => {
    if (node.attributes?.name) {
      names.push(node?.attributes?.name);
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

export default getNamesFromTree;
