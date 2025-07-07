import type { Params, TreeNode } from "@tracktor/types-treege";
import findParentNodeByUUIDInTree from "@/utils/tree/findParentNodeByUUIDInTree/findParentNodeByUUIDInTree";
import getNode from "@/utils/tree/getNode/getNode";
import getTree from "@/utils/tree/getTree/getTree";

interface RemoveNodeParams {
  tree: TreeNode | null;
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

  // if a parent or nodeToRemove is a Decision, then remove node and its children
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
 * Get parent node by uuid in the current tree
 * @param tree
 * @param path
 * @param uuid
 */
const getParentTreeNode = (tree: TreeNode, path: string, uuid: string) => {
  const currentTree = getTree(tree, path);
  return findParentNodeByUUIDInTree(currentTree, uuid);
};

const removeAncestorReferences = (node: TreeNode, uuidToRemove: string): TreeNode => {
  const updatedAttributes = { ...node.attributes };

  if (updatedAttributes.defaultValueFromAncestor?.uuid === uuidToRemove) {
    delete updatedAttributes.defaultValueFromAncestor;
  }

  if (updatedAttributes.route?.params) {
    updatedAttributes.route = {
      ...updatedAttributes.route,
      params: updatedAttributes.route.params.filter((param: Params) => param.ancestorUuid !== uuidToRemove),
    };
  }

  const updatedChildren = node.children?.map((child) => removeAncestorReferences(child, uuidToRemove)) || [];

  return {
    ...node,
    attributes: updatedAttributes,
    children: updatedChildren,
  };
};

/**
 * Remove node from a tree
 * @param tree
 * @param path
 * @param uuid
 */
const removeNode = ({ tree, path, uuid }: RemoveNodeParams) => {
  if (!tree) {
    return null;
  }

  const treeCopy = structuredClone(tree);
  const nodeToRemove = getNode(treeCopy, path, uuid);
  const parentNodeToRemove = getParentTreeNode(treeCopy, path, uuid);

  removeTreeNode(parentNodeToRemove, nodeToRemove);

  return removeAncestorReferences(treeCopy, uuid);
};

export default removeNode;
