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

  // Determine which children to keep
  const children = isDecision ? { value: [...newNode.children] } : { value: [...node.children] };

  // For the root node, we keep existing children and never set it as a leaf
  const { isRoot } = node.attributes;

  const attributes = {
    value: defineNodePosition({
      attributes: newNode.attributes,
      hasChildren: isRoot ? true : children.value.length > 0,
      isRoot,
    }),
  };

  Object.defineProperties(node, {
    attributes,
    children,
    uuid,
  });

  return null;
};

export const updateNodeInTree = ({ tree, path, uuid, children }: UpdatedNodeParams) => {
  const treeCopy = structuredClone(tree);
  const node = getNode(treeCopy, path, uuid);

  updateNodeByRef(node, children);

  return treeCopy;
};

export default updateNodeInTree;
