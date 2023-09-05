import type { TreeNode } from "@/features/Treege/type/TreeNode";
import findParentNodeByNameInTree from "@/utils/tree/findParentNodeByNameInTree/findParentNodeByNameInTree";
import getNode from "@/utils/tree/getNode/getNode";
import getTree from "@/utils/tree/getTree/getTree";

interface RemoveNodeParams {
  tree: TreeNode;
  path: string;
  name: string;
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

  Object.defineProperty(parent, "children", { value: parent.children.filter((child) => child.name !== node.name) });
  Object.defineProperty(parent, "attributes", { value: { ...parent.attributes, isLeaf: true } });

  return null;
};

/**
 * Get parent node by name in current tree
 * @param tree
 * @param path
 * @param name
 */
const getParentTreeNode = (tree: TreeNode, path: string, name: string) => {
  const currentTree = getTree(tree, path);
  return findParentNodeByNameInTree(currentTree, name);
};

/**
 * Remove node from tree
 * @param tree
 * @param path
 * @param name
 */
const removeNode = ({ tree, path, name }: RemoveNodeParams) => {
  const treeCopy = structuredClone(tree);

  const node = getNode(treeCopy, path, name);
  const nodeParent = getParentTreeNode(treeCopy, path, name);

  removeTreeNode(nodeParent, node);

  return treeCopy;
};

export default removeNode;
