import type { TreeNode } from "@/features/Treege/type/TreeNode";
import getNode from "@/utils/tree/getNode/getNode";
import getParentNodeByNameInCurrentTree from "@/utils/tree/getParentNodeByNameInCurrentTree/getParentNodeByNameInCurrentTree";
import getTree from "@/utils/tree/getTree/getTree";

interface RemoveNodeParams {
  tree: TreeNode;
  path: string;
  name: string;
}

const removeTreeNode = (parent: TreeNode | null, node: TreeNode | null) => {
  if (!parent || !node) return null;

  Object.defineProperty(parent, "children", { value: parent.children.filter((child) => child.name !== node.name) });
  Object.defineProperty(parent, "attributes", { value: { ...parent.attributes, isLeaf: true } });

  return null;
};

const getParentTreeNode = (tree: TreeNode, path: string, name: string) => {
  const currentTree = getTree(tree, path);
  return getParentNodeByNameInCurrentTree(currentTree, name);
};

const removeNode = ({ tree, path, name }: RemoveNodeParams) => {
  const treeCopy = structuredClone(tree);

  const node = getNode(treeCopy, path, name);
  const nodeParent = getParentTreeNode(treeCopy, path, name);

  removeTreeNode(nodeParent, node);

  return treeCopy;
};

export default removeNode;
