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
 * @param nodeToRemove
 */
const removeTreeNode = (parent: TreeNode | null, nodeToRemove: TreeNode | null) => {
  if (!parent || !nodeToRemove) {
    return null;
  }

  // if parent or nodeToRemove is a Decision, then remove node and its children
  if (parent.attributes.isDecision || nodeToRemove.attributes.isDecision) {
    // Remove node and its children
    Object.defineProperty(parent, "children", {
      value: [...parent.children.filter((child) => child.uuid !== nodeToRemove.uuid)],
    });

    // Set isLeaf to parent node if it has no children
    Object.defineProperty(parent, "attributes", {
      value: {
        ...parent.attributes,
        isLeaf: !parent.children.length,
      },
    });

    return null;
  }

  // Remove node and append its children to parent node
  Object.defineProperty(parent, "children", {
    value: [...parent.children.filter((child) => child.uuid !== nodeToRemove.uuid), ...nodeToRemove.children],
  });

  // Set isLeaf to parent node if nodeToRemove has no children
  Object.defineProperty(parent, "attributes", {
    value: {
      ...parent.attributes,
      isLeaf: !nodeToRemove.children.length,
    },
  });

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
  const nodeToRemove = getNode(treeCopy, path, uuid);
  const parentNodeToRemove = getParentTreeNode(treeCopy, path, uuid);

  removeTreeNode(parentNodeToRemove, nodeToRemove);

  return treeCopy;
};

export default removeNode;
