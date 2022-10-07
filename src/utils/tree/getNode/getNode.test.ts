import { expect } from "vitest";
import getNode from "@/utils/tree/getNode/getNode";
import { treeInTreeMock } from "@/utils/tree/getNodeNames/mock";

describe("getNodeNames", () => {
  test("Simple tree", () => {
    const { input, output, treePath, name } = treeInTreeMock;
    const result = getNode(input, treePath, name);

    expect(result).toEqual(output);
  });
});
