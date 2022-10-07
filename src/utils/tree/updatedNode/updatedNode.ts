import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";
import getNode from "@/utils/tree/getNode/getNode";

interface AppendChildParams {
  tree: TreeNode;
  path: string;
  name: string;
  child: TreeNode;
}

const updatedByRef = (node: TreeNode | null, newNode: TreeNode) => {
  if (!node) return null;

  const { attributes, name, children } = newNode;
  node.name = name;
  node.attributes = { ...attributes, isLeaf: !children.length };

  return null;
};

const updatedNode = ({ tree, path, name, child }: AppendChildParams) => {
  const treeCopy = { ...tree };
  const node = getNode(treeCopy, path, name);

  updatedByRef(node, child);

  return treeCopy;
};

export default updatedNode;
