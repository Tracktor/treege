import type { TreeNode } from "@/features/Treege/type/TreeNode";
import findNodeByUUIDInTree from "@/utils/tree/findNodeByUUIDInTree/findNodeByUUIDInTree";
import getTree from "@/utils/tree/getTree/getTree";

/**
 * Get node
 * @param node
 * @param path
 * @param name
 */
const getNode = (node: TreeNode, path: string | null, name: string) => {
  const currentTree = getTree(node, path);
  return findNodeByUUIDInTree(currentTree, name);
};

export default getNode;
