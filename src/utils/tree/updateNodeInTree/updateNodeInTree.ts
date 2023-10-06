import type { TreeNode } from "@/features/Treege/type/TreeNode";
import getNode from "@/utils/tree/getNode/getNode";

interface UpdatedNodeParams {
  tree: TreeNode;
  path: string;
  name: string;
  child: TreeNode;
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
  const name = { value: newNode.name };
  const isDecision = isNodeDecision || isNewChildDecision;
  const children = isDecision ? { value: [...newNode.children] } : { value: [...node.children] };

  const attributes = isDecision
    ? { value: { ...newNode.attributes, isLeaf: !newNode.children.length || !isNewChildDecision, isRoot } }
    : { value: { ...newNode.attributes, isLeaf: !node.children.length, isRoot } };

  Object.defineProperties(node, {
    attributes,
    children,
    name,
  });

  return null;
};

/**
 * Update node in tree
 * @param tree
 * @param path
 * @param name
 * @param child
 */
const updateNodeInTree = ({ tree, path, name, child }: UpdatedNodeParams) => {
  const treeCopy = structuredClone(tree);
  const node = getNode(treeCopy, path, name);

  updateNodeByRef(node, child);

  return treeCopy;
};

export default updateNodeInTree;
