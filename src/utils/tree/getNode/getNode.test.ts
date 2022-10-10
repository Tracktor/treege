import { expect } from "vitest";
import getNode from "@/utils/tree/getNode/getNode";
import simpleTreeMock from "@/utils/tree/getNode/mock";

describe("getNodeNames", () => {
  test("Simple tree", () => {
    const { input, output, treePath, name } = simpleTreeMock;
    const result = getNode(input, treePath, name);

    expect(result).toEqual(output);
  });
});
