import type { TreeNode } from "@tracktor/types-treege";

/**
 * Get unique tags from tree
 * @param tree
 */
const getUniqueTagsInTree = (tree: TreeNode | null): string[] => {
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

export default getUniqueTagsInTree;
