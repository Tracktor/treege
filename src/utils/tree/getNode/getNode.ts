import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";
import getNodeByNameInCurrentTree from "@/utils/tree/getNodeByNameInCurrentTree/getNodeByNameInCurrentTree";
import getTree from "@/utils/tree/getTree/getTree";

const getNode = (tree: TreeNode, path: string, name: string) => getNodeByNameInCurrentTree(getTree(tree, path), name);

export default getNode;
