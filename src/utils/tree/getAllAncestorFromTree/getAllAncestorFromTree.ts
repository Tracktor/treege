import type { TreeNode } from "@tracktor/types-treege";

/**
 * Get all ancestor names from tree
 * @param tree
 * @param uuid
 */
const getAllAncestorFromTree = (tree: TreeNode | null, uuid: string | undefined): { uuid: string; name?: string }[] => {
  if (!tree || !uuid) {
    return [];
  }

  const path: { uuid: string; name?: string }[] = [];

  const extractNode = (node: TreeNode): boolean => {
    const { attributes, uuid: uuidNode } = node;

    path.push({ name: attributes?.name, uuid: uuidNode });

    if (uuidNode === uuid) {
      return true;
    }

    const foundInChildren = node.children.some((child) => extractNode(child));

    if (foundInChildren) {
      return true;
    }

    path.pop();
    return false;
  };

  extractNode(tree);
  return path.slice(0, -1);
};
export default getAllAncestorFromTree;
