import type { TreeNode } from "@/features/Treege/type/TreeNode";

/**
 * Get node tags from tree
 * @param tree
 */
const getNodeTags = (tree: TreeNode | null): string[] => {
  if (!tree) {
    return [];
  }

  const nodeTags: Set<string> = new Set();

  const extractNodeNames = (node: TreeNode) => {
    if (node?.attributes?.tag) {
      nodeTags.add(node.attributes.tag);
    }
    if (node?.children?.length) {
      const { children } = node;
      for (let i = 0; i < children.length; i += 1) {
        extractNodeNames(children[i]);
      }
    }
  };

  extractNodeNames(tree);

  return [...nodeTags];
};

export default getNodeTags;
