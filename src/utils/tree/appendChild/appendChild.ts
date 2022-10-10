import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";
import getNode from "@/utils/tree/getNode/getNode";

interface AppendChildParams {
  tree: TreeNode;
  path: string;
  name: string;
  child: TreeNode;
}

const addChildByRef = (node: TreeNode | null, child: TreeNode) => {
  if (!node) return null;

  const isChildDecision = child.attributes.isDecision;
  Object.defineProperty(node, "attributes", { value: { ...node.attributes, isLeaf: false } });

  if (isChildDecision) {
    Object.defineProperty(node, "children", { value: [{ ...child, attributes: { ...child.attributes, isLeaf: false } }] });
    return null;
  }

  Object.defineProperty(node, "children", { value: [{ ...child, attributes: { ...child.attributes, isLeaf: true } }] });
  return null;
};

const appendChild = ({ tree, path, name, child }: AppendChildParams) => {
  const treeCopy = structuredClone(tree);

  const { isRoot } = child.attributes;

  if (isRoot) {
    return { ...child, attributes: { ...child.attributes, isLeaf: true } };
  }

  const node = getNode(treeCopy, path, name);

  addChildByRef(node, child);

  return treeCopy;
};

export default appendChild;
