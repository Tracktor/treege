import type { TreeNode } from "@tracktor/types-treege";
import getNode from "@/utils/tree/getNode/getNode";

interface UpdatedNodeParams {
  tree: TreeNode | null;
  path: string;
  uuid: string;
  children: TreeNode;
}

/**
 * Update node by reference
 * @param node
 * @param newNode
 */
const updateNodeByRef = (node: TreeNode | null, newNode: TreeNode) => {
  if (!node) {
    return null;
  }

  const isNewChildDecision = newNode.attributes.isDecision;
  const isNodeDecision = node.attributes.isDecision;
  const isRoot = node.attributes.depth === 0;
  const uuid = { value: newNode.uuid };
  const isDecision = isNodeDecision || isNewChildDecision;
  const children = isDecision ? { value: [...newNode.children] } : { value: [...node.children] };

  const attributes = isDecision
    ? {
        value: {
          ...newNode.attributes,
          ...(isRoot && { isRoot: true }),
          isLeaf: !newNode.children.length || !isNewChildDecision,
        },
      }
    : {
        value: {
          ...newNode.attributes,
          ...(isRoot && { isRoot: true }),
          isLeaf: !node.children.length,
        },
      };

  Object.defineProperties(node, {
    attributes,
    children,
    uuid,
  });

  return null;
};

/**
 * Update node in a tree
 * @param tree
 * @param path
 * @param uuid
 * @param children
 */
const updateNodeInTree = ({ tree, path, uuid, children }: UpdatedNodeParams) => {
  if (!tree) {
    return null;
  }

  const treeCopy = structuredClone(tree);
  const node = getNode(treeCopy, path, uuid);

  updateNodeByRef(node, children);

  return treeCopy;
};

export default updateNodeInTree;
