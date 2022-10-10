import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

const getNodeNames = (tree: TreeNode | null, attributeAccumulator: string[] = []) => {
  if (!tree) return [];
  let arrayNames = [...attributeAccumulator];

  Object.entries(tree).forEach(([key, value]) => {
    const isName = key === "name";
    const hasChildren = key === "children" && value.length > 0;

    if (isName) {
      arrayNames = [...arrayNames, value];
    }

    if (hasChildren) {
      arrayNames = [...arrayNames, ...value.map((child: TreeNode) => getNodeNames(child, arrayNames)).flat()];
    }
  });

  return arrayNames;
};

export default getNodeNames;
