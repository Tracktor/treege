import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";
import getNode from "@/utils/tree/getNode/getNode";
import getParentNodeByNameInCurrentTree from "@/utils/tree/getParentNodeByNameInCurrentTree/getParentNodeByNameInCurrentTree";
import getTree from "@/utils/tree/getTree/getTree";

const removeTreeNode = (parent: TreeNode | null, node: TreeNode | null, onlyNode = false) => {
  if (!parent || !node) return null;

  if (parent.children.length <= 1 && onlyNode) {
    parent.children = [node.children];
    return null;
  }
  parent.children = parent.children.filter((child) => child.name !== node.name);

  return null;
};

const getParentTreeNode = (tree: TreeNode, path: string, name: string) => {
  const currentTree = getTree(tree, path);
  return getParentNodeByNameInCurrentTree(currentTree, name);
};

const removeNode = (tree: TreeNode, path: string, name: string) => {
  const treeCopy = { ...tree };

  const node = getNode(treeCopy, path, name);
  const nodeParent = getParentTreeNode(treeCopy, path, name);

  removeTreeNode(nodeParent, node);

  return treeCopy;
};

export default removeNode;
