import type { TreeNode } from "@tracktor/types-treege";
import findNodeByUUIDInTree from "@/utils/tree/findNodeByUUIDInTree/findNodeByUUIDInTree";
import getTree from "@/utils/tree/getTree/getTree";

/**
 * Get node
 * @param node
 * @param path
 * @param uuid
 */
const getNode = (node: TreeNode, path: string | null, uuid: string) => {
  const currentTree = getTree(node, path);
  return findNodeByUUIDInTree(currentTree, uuid);
};

export default getNode;
