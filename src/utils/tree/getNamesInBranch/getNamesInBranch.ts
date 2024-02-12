interface TreeNode {
  name: string;
  children: TreeNode[];
}

const getNamesInBranch = (tree: TreeNode | null, targetName: string): string[] => {
  if (!tree) {
    return [];
  }

  const nodeNames: string[] = [];

  const extractNodeNames = (node: TreeNode, target: string, currentNames: string[] = []) => {
    if (node.name === target) {
      nodeNames.push(...currentNames);
      return;
    }

    currentNames.push(node.name);

    if (node.children.length) {
      const { children } = node;
      for (let i = 0; i < children.length; i += 1) {
        extractNodeNames(children[i], target, [...currentNames]);
      }
    }
  };

  extractNodeNames(tree, targetName);

  return nodeNames;
};

export default getNamesInBranch;
