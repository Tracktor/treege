import type { TreeNode } from "@/features/Treege/type/TreeNode";
import getNode from "@/utils/tree/getNode/getNode";

interface AppendChildParams {
  tree: TreeNode | null;
  path: string | null;
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

  Object.defineProperty(node, "children", { value: [{ ...child, attributes: { ...child.attributes, isLeaf: !node.children.length } }] });
  return null;
};

const appendNode = ({ tree, path, name, child }: AppendChildParams) => {
  console.log("appendNode", JSON.stringify({ child, name, path, tree }));
  if (!tree) {
    // Initialise Tree
    if (child.children.length) {
      return { ...child };
    }

    // Add first element
    return { ...child, attributes: { ...child.attributes, isLeaf: true, isRoot: true } };
  }

  const treeCopy = structuredClone(tree);
  const node = getNode(treeCopy, path, name);

  addChildByRef(node, { ...child, ...(!child.attributes.isDecision && { children: [...(getNode(tree, path, name)?.children || [])] }) });

  return treeCopy;
};

export default appendNode;
