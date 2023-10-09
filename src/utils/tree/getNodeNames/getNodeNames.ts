import type { TreeNode } from "@/features/Treege/type/TreeNode";

/**
 * Get node names from tree
 * @param tree
 */
const getNodeNames = (tree: TreeNode | null): string[] => {
  if (!tree) {
    return [];
  }

  const nodeNames: string[] = [];

  const extractNodeNames = (node: TreeNode) => {
    if (node.name) {
      nodeNames.push(node.name);
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

export default getNodeNames;
