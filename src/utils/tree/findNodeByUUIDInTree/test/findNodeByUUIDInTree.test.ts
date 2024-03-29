import findNodeByUUIDInTree from "@/utils/tree/findNodeByUUIDInTree/findNodeByUUIDInTree";
import {
  simpleTree,
  treeWithDecision,
  treeWithTreeMatchTree,
  treeWithTreeMock,
  treeWithTreeNoMatch,
} from "@/utils/tree/findNodeByUUIDInTree/test/mock";

describe("getNodeNames", () => {
  test("Simple tree", () => {
    const { input, output, searchName } = simpleTree;
    const result = findNodeByUUIDInTree(input, searchName);

    expect(result).toEqual(output);
  });

  test("tree with decision", () => {
    const { input, output, searchName } = treeWithDecision;
    const result = findNodeByUUIDInTree(input, searchName);

    expect(result).toEqual(output);
  });

  test("tree with tree (he searching just in current tree)", () => {
    const { input, output, searchName } = treeWithTreeMock;
    const result = findNodeByUUIDInTree(input, searchName);

    expect(result).toEqual(output);
  });

  test("tree with tree (search in last tree return null)", () => {
    const { input, output, searchName } = treeWithTreeNoMatch;
    const result = findNodeByUUIDInTree(input, searchName);

    expect(result).toEqual(output);
  });

  test("tree with tree (matching tree name)", () => {
    const { input, output, searchName } = treeWithTreeMatchTree;
    const result = findNodeByUUIDInTree(input, searchName);

    expect(result).toEqual(output);
  });
});
