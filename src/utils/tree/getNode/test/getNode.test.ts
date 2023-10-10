import getNode from "@/utils/tree/getNode/getNode";
import { mainTreeWithTreeMock, simpleTreeMock, treeWithFields, treeWithTreeMock } from "@/utils/tree/getNode/test/mock";

describe("getNodeNames", () => {
  test("Simple tree", () => {
    const { input, output, treePath, name } = simpleTreeMock;
    const result = getNode(input, treePath, name);

    expect(result).toEqual(output);
  });

  test("Tree with Fields", () => {
    const { input, output, treePath, name } = treeWithFields;
    const result = getNode(input, treePath, name);

    expect(result).toEqual(output);
  });

  test("Search in Tree with Tree", () => {
    const { input, output, treePath, name } = treeWithTreeMock;
    const result = getNode(input, treePath, name);

    expect(result).toEqual(output);
  });

  test("Search in main Tree with Tree", () => {
    const { input, output, treePath, name } = mainTreeWithTreeMock;
    const result = getNode(input, treePath, name);

    expect(result).toEqual(output);
  });
});
