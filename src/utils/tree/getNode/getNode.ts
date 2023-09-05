import type { TreeNode } from "@/features/Treege/type/TreeNode";
import findNodeByNameInTree from "@/utils/tree/findNodeByNameInTree/findNodeByNameInTree";
import getTree from "@/utils/tree/getTree/getTree";

/**
 * Get node
 * @param node
 * @param path
 * @param name
 */
const getNode = (node: TreeNode, path: string | null, name: string) => {
  const currentTree = getTree(node, path);
  return findNodeByNameInTree(currentTree, name);
};

export default getNode;
