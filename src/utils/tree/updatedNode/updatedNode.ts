import type { TreeNode } from "@/features/Treege/type/TreeNode";
import getNode from "@/utils/tree/getNode/getNode";

interface UpdatedNodeParams {
  tree: TreeNode;
  path: string;
  name: string;
  child: TreeNode;
}

const updatedByRef = (node: TreeNode | null, newNode: TreeNode) => {
  if (!node) return null;

  const isNewChildDecision = newNode.attributes.isDecision;
  const isNodeDecision = node.attributes.isDecision;
  const isRoot = node.attributes.depth === 0;

  if (isNewChildDecision || isNodeDecision) {
    Object.defineProperty(node, "children", { value: [...newNode.children] });
    Object.defineProperty(node, "attributes", {
      value: { ...newNode.attributes, isLeaf: !newNode.children.length || !isNewChildDecision, isRoot },
    });
    Object.defineProperty(node, "name", { value: newNode.name });

    return null;
  }

  Object.defineProperty(node, "children", { value: [...node.children] });
  Object.defineProperty(node, "attributes", { value: { ...newNode.attributes, isLeaf: !node.children.length, isRoot } });
  Object.defineProperty(node, "name", { value: newNode.name });

  return null;
};

const updatedNode = ({ tree, path, name, child }: UpdatedNodeParams) => {
  const treeCopy = structuredClone(tree);
  const node = getNode(treeCopy, path, name);

  updatedByRef(node, child);

  return treeCopy;
};

export default updatedNode;
