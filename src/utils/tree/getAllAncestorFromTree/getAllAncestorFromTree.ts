import type { TreeNode } from "@tracktor/types-treege";

/**
 * Get all ancestor names from tree
 * @param tree
 * @param uuid
 * @param excludeUuid
 */
const getAllAncestorFromTree = (
  tree: TreeNode | null,
  uuid: string | undefined,
  excludeUuid?: string,
): { uuid: string; name?: string }[] => {
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

    const foundInChildren = node.children?.some((child) => extractNode(child)) ?? false;

    if (foundInChildren) {
      return true;
    }

    path.pop();
    return false;
  };

  extractNode(tree);

  return excludeUuid ? path.filter((node) => node.uuid !== excludeUuid) : path;
};

export default getAllAncestorFromTree;
