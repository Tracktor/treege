import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

const getTreeNames = (
  tree: { children: TreeNode["children"]; name?: TreeNode["name"]; attributes?: TreeNode["attributes"] },
  attributeAccumulator: string[] = []
): string[] => {
  let arrayNames = [...attributeAccumulator];

  // if one Field Element
  if (!tree.children.length && !attributeAccumulator.length && tree?.name) {
    return [tree.name];
  }

  // if last element
  if (!tree.children.length) {
    return attributeAccumulator;
  }

  // add first tree name
  if (tree.name) {
    arrayNames = [...arrayNames, tree.name];
  }

  const result = tree.children.map(({ name, children }) => {
    // if More than on children (decision section)
    if (children.length > 1) {
      const results = children.map((val) => getTreeNames({ children: val.children }));
      const flattenResult = results.flat();

      return { names: [...arrayNames, ...flattenResult, name], rest: { children: [] } };
    }

    return { names: [...arrayNames, name], rest: { children } };
  });

  const { rest, names } = result[0];

  return getTreeNames(rest, names);
};

export default getTreeNames;
