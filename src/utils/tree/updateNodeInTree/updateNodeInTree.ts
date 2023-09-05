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
  const isRoot = node.attributes.depth === 0;

  const updatedAttributes = {
    ...newNode.attributes,
    isLeaf: !newNode.children.length || !isNewChildDecision,
    isRoot,
  };

  Object.defineProperties(node, {
    attributes: { value: updatedAttributes },
    children: { value: [...newNode.children] },
    name: { value: newNode.name },
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
