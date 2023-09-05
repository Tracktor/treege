import { expect } from "vitest";
import findParentNodeByNameInTree from "@/utils/tree/findParentNodeByNameInTree/findParentNodeByNameInTree";
import {
  searchNameInOtherTreeMock,
  simpleTreeMock,
  treeInTreeMock,
  treeInTreeNoNameMock,
} from "@/utils/tree/findParentNodeByNameInTree/test/mock";

describe("get Parent Node by name", () => {
  test("Search node in simple tree", () => {
    const { input, output, name } = simpleTreeMock;
    const result = findParentNodeByNameInTree(input, name);

    expect(result).toEqual(output);
  });

  test("search Tree in tree", () => {
    const { input, output, name } = treeInTreeMock;
    const result = findParentNodeByNameInTree(input, name);

    expect(result).toEqual(output);
  });

  test("search non-existent name in a tree => result null", () => {
    const { input, output, name } = treeInTreeNoNameMock;
    const result = findParentNodeByNameInTree(input, name);

    expect(result).toEqual(output);
  });

  test("try to search name in other Tree => result null", () => {
    const { input, output, name } = searchNameInOtherTreeMock;
    const result = findParentNodeByNameInTree(input, name);

    expect(result).toEqual(output);
  });
});
