import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";
import getNodeByNameInCurrentTree from "@/utils/tree/getNodeByNameInCurrentTree/getNodeByNameInCurrentTree";
import getTree from "@/utils/tree/getTree/getTree";

const getNode = (tree: TreeNode, path: string, name: string) => {
  const currentTree = getTree(tree, path);
  return getNodeByNameInCurrentTree(currentTree, name);
};

export default getNode;
