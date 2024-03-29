import getUuidsInTree from "@/utils/tree/getUuidsInTree/getUuidsInTree";
import {
  complexeTreeWithMultiDecisionFields,
  treeWithDecisionFields,
  treeWithMultiFields,
  treeWithOneField,
  treeWithTree,
} from "@/utils/tree/getUuidsInTree/test/mock";

describe("get Names In Tree", () => {
  test("tree With one Field", () => {
    const { input, output } = treeWithOneField;
    const result = getUuidsInTree(input);

    expect(result.sort()).toEqual(output);
  });

  test("tree With multi Fields", () => {
    const { input, output } = treeWithMultiFields;
    const result = getUuidsInTree(input);

    expect(result.sort()).toEqual(output);
  });

  test("tree With value decision Fields", () => {
    const { input, output } = treeWithDecisionFields;
    const result = getUuidsInTree(input);

    expect(result.sort()).toEqual(output);
  });

  test("Complexe tree With multi value decision Fields", () => {
    const { input, output } = complexeTreeWithMultiDecisionFields;
    const result = getUuidsInTree(input);

    expect(result.sort()).toEqual(output);
  });

  test("tree With tree", () => {
    const { input, output } = treeWithTree;
    const result = getUuidsInTree(input);

    expect(result.sort()).toEqual(output);
  });
});
