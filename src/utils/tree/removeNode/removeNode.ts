import type { TreeNode } from "@/features/Treege/type/TreeNode";
import findParentNodeByUUIDInTree from "@/utils/tree/findParentNodeByUUIDInTree/findParentNodeByUUIDInTree";
import getNode from "@/utils/tree/getNode/getNode";
import getTree from "@/utils/tree/getTree/getTree";

interface RemoveNodeParams {
  tree: TreeNode;
  path: string;
  uuid: string;
}

/**
 * Remove tree node
 * @param parent
 * @param node
 */
const removeTreeNode = (parent: TreeNode | null, node: TreeNode | null) => {
  if (!parent || !node) {
    return null;
  }

  Object.defineProperty(parent, "children", { value: parent.children.filter((child) => child.uuid !== node.uuid) });
  Object.defineProperty(parent, "attributes", { value: { ...parent.attributes, isLeaf: true } });

  return null;
};

/**
 * Get parent node by uuid in current tree
 * @param tree
 * @param path
 * @param uuid
 */
const getParentTreeNode = (tree: TreeNode, path: string, uuid: string) => {
  const currentTree = getTree(tree, path);
  return findParentNodeByUUIDInTree(currentTree, uuid);
};

/**
 * Remove node from tree
 * @param tree
 * @param path
 * @param uuid
 */
const removeNode = ({ tree, path, uuid }: RemoveNodeParams) => {
  const treeCopy = structuredClone(tree);

  const node = getNode(treeCopy, path, uuid);
  const nodeParent = getParentTreeNode(treeCopy, path, uuid);

  removeTreeNode(nodeParent, node);

  return treeCopy;
};

export default removeNode;
