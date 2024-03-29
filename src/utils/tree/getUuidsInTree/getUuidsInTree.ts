import type { TreeNode } from "@/features/Treege/type/TreeNode";

/**
 * Get all uuid from tree
 * @param tree
 */
const getUuidsInTree = (tree: TreeNode | null): string[] => {
  if (!tree) {
    return [];
  }

  const nodeNames: string[] = [];

  const extractNodeNames = (node: TreeNode) => {
    if (node.uuid) {
      nodeNames.push(node.uuid);
    }

    if (node.children.length) {
      const { children } = node;

      for (let i = 0; i < children.length; i += 1) {
        extractNodeNames(children[i]);
      }
    }
  };

  extractNodeNames(tree);

  return nodeNames;
};

export default getUuidsInTree;
