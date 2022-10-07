import { expect } from "vitest";
import getNodeByNameInCurrentTree from "@/utils/tree/getNodeByNameInCurrentTree/getNodeByNameInCurrentTree";
import {
  simpleTree,
  treeWithDecision,
  treeWithTreeMatchTree,
  treeWithTreeMock,
  treeWithTreeNoMatch,
} from "@/utils/tree/getNodeByNameInCurrentTree/mock";

describe("getNodeNames", () => {
  test("Simple tree", () => {
    const { input, output, searchName } = simpleTree;
    const result = getNodeByNameInCurrentTree(input, searchName);

    expect(result).toEqual(output);
  });

  test("tree with decision", () => {
    const { input, output, searchName } = treeWithDecision;
    const result = getNodeByNameInCurrentTree(input, searchName);

    expect(result).toEqual(output);
  });

  test("tree with tree (he searching just in current tree)", () => {
    const { input, output, searchName } = treeWithTreeMock;
    const result = getNodeByNameInCurrentTree(input, searchName);

    expect(result).toEqual(output);
  });

  test("tree with tree (search in last tree return null)", () => {
    const { input, output, searchName } = treeWithTreeNoMatch;
    const result = getNodeByNameInCurrentTree(input, searchName);

    expect(result).toEqual(output);
  });

  test("tree with tree (matching tree name)", () => {
    const { input, output, searchName } = treeWithTreeMatchTree;
    const result = getNodeByNameInCurrentTree(input, searchName);

    expect(result).toEqual(output);
  });
});
