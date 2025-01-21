import type { TreeNode } from "@/features/Treege/type/TreeNode";
import getAllAncestorNamesFromTree from "@/utils/tree/getAllAncestorNamesFromTree/getAllAncestorNamesFromTree";

/**
 * Get all names from tree
 * @param tree
 */
export const getAllNamesFromTree = (tree: TreeNode | null): string[] => getAllAncestorNamesFromTree(tree, undefined);

export default getAllNamesFromTree;
