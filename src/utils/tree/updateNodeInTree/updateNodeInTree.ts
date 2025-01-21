import type { TreeNode } from "@/features/Treege/type/TreeNode";
import defineNodePosition from "@/utils/tree/defineNodePosition/defineNodePosition";
import getNode from "@/utils/tree/getNode/getNode";

interface UpdatedNodeParams {
  tree: TreeNode;
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
  const uuid = { value: newNode.uuid };
  const isDecision = isNodeDecision || isNewChildDecision;
  const children = isDecision ? { value: [...newNode.children] } : { value: [...node.children] };

  const hasChildren = newNode.children.length > 0;

  const attributes = {
    value: defineNodePosition({
      attributes: newNode.attributes,
      hasChildren,
    }),
  };

  Object.defineProperties(node, {
    attributes,
    children,
    uuid,
  });

  return null;
};

/**
 * Update node in tree
 * @param tree
 * @param path
 * @param uuid
 * @param children
 */
export const updateNodeInTree = ({ tree, path, uuid, children }: UpdatedNodeParams) => {
  const treeCopy = structuredClone(tree);
  const node = getNode(treeCopy, path, uuid);

  updateNodeByRef(node, children);

  return treeCopy;
};

export default updateNodeInTree;
