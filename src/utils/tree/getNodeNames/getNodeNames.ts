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
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        extractNodeNames(child);
      }
    }
  };

  extractNodeNames(tree);

  return nodeNames;
};

export default getNodeNames;
