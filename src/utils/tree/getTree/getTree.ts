import type { TreeNode } from "@/features/Treege/type/TreeNode";

const getTree = (element: TreeNode | undefined, searchPath?: string): TreeNode | null => {
  if (!element) return null;

  if (!searchPath) return element;

  let result = null;

  const hasPath = element?.attributes?.treePath === searchPath;
  const hasTree = element?.attributes?.tree;
  const hasChildren = element?.children?.length;

  if (hasPath) {
    return element?.attributes?.tree || null;
  }

  if (hasTree) {
    result = getTree(element.attributes?.tree, searchPath);
  }

  if (hasChildren) {
    for (let i = 0; result === null && i < element.children.length; i += 1) {
      result = getTree(element.children[i], searchPath);
    }
  }

  return result;
};

export default getTree;
