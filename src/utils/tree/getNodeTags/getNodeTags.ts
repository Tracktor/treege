import type { TreeNode } from "@/features/Treege/type/TreeNode";

/**
 * Get node names from tree
 * @param tree
 */
const getNodeTags = (tree: TreeNode | null): string[] => {
  if (!tree) {
    return [];
  }

  const nodeTags: Set<string> = new Set();

  const extractNodeNames = (node: TreeNode) => {
    if (node?.tag) {
      nodeTags.add(node?.tag);
    }
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        extractNodeNames(child);
      }
    }
  };

  extractNodeNames(tree);

  return Array.from(nodeTags);
};

export default getNodeTags;
