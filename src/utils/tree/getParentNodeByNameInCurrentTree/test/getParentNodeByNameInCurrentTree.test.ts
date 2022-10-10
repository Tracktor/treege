import { expect } from "vitest";
import getParentNodeByNameInCurrentTree from "@/utils/tree/getParentNodeByNameInCurrentTree/getParentNodeByNameInCurrentTree";
import {
  searchNameInOtherTreeMock,
  simpleTreeMock,
  treeInTreeMock,
  treeInTreeNoNameMock,
} from "@/utils/tree/getParentNodeByNameInCurrentTree/test/mock";

describe("get Parent Node by name", () => {
  test("Search node in simple tree", () => {
    const { input, output, name } = simpleTreeMock;
    const result = getParentNodeByNameInCurrentTree(input, name);

    expect(result).toEqual(output);
  });

  test("search Tree in tree", () => {
    const { input, output, name } = treeInTreeMock;
    const result = getParentNodeByNameInCurrentTree(input, name);

    expect(result).toEqual(output);
  });

  test("search non-existent name in a tree => result null", () => {
    const { input, output, name } = treeInTreeNoNameMock;
    const result = getParentNodeByNameInCurrentTree(input, name);

    expect(result).toEqual(output);
  });

  test("try to search name in other Tree => result null", () => {
    const { input, output, name } = searchNameInOtherTreeMock;
    const result = getParentNodeByNameInCurrentTree(input, name);

    expect(result).toEqual(output);
  });
});
