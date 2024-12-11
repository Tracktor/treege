import { TreeNode } from "@/features/Treege/type/TreeNode";
import { transformTreeToFlow } from "@/utils/tree/transformTreeToFlow/transformTreeToFlow";

const useTreeTransformer = (treeData: TreeNode | null) => {
  if (!treeData) {
    return { edges: [], nodes: [] };
  }

  return transformTreeToFlow(treeData);
};

export default useTreeTransformer;
