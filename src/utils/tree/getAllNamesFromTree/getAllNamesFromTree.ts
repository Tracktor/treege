import type { TreeNode } from "@/features/Treege/type/TreeNode";
import { getAllAncestorNamesFromTree } from "@/utils/tree";

/**
 * Get all names from tree
 * @param tree
 */
const getAllNamesFromTree = (tree: TreeNode | null): string[] => getAllAncestorNamesFromTree(tree, undefined);

export default getAllNamesFromTree;
