import type { TreeNode } from "@tracktor/types-treege";
import getNode from "@/utils/tree/getNode/getNode";

interface AppendChildParams {
  tree: TreeNode | null;
  path: string | null;
  uuid: string;
  child: TreeNode;
}

/**
 * Add child by reference
 * @param node
 * @param child
 */
const addChildByRef = (node: TreeNode | null, child: TreeNode) => {
  if (!node) {
    return null;
  }

  const { attributes } = child;
  const isChildDecision = attributes.isDecision;

  // Remove isLeaf from node
  Object.defineProperty(node, "attributes", { value: { ...node.attributes, isLeaf: false } });

  if (isChildDecision) {
    // Add child to node children list and remove isLeaf from node
    Object.defineProperty(node, "children", { value: [{ ...child, attributes: { ...attributes, isLeaf: false } }] });
    return null;
  }

  // Add child to node children list and remove isLeaf from node if child is not have children
  Object.defineProperty(node, "children", { value: [{ ...child, attributes: { ...attributes, isLeaf: !node.children.length } }] });

  return null;
};

/**
 * Append child to tree
 * @param tree
 * @param path
 * @param uuid
 * @param child
 */
const appendNode = ({ tree, path, uuid, child }: AppendChildParams) => {
  const { attributes, children } = child;

  if (!tree) {
    // Initialize Tree
    if (children.length) {
      return { ...child };
    }

    // Add first element
    return { ...child, attributes: { ...attributes, isLeaf: true, isRoot: true } };
  }

  const treeCopy = structuredClone(tree);
  const node = getNode(treeCopy, path, uuid);

  addChildByRef(node, { ...child, ...(!attributes.isDecision && { children: [...(getNode(tree, path, uuid)?.children || [])] }) });

  return treeCopy;
};

export default appendNode;
