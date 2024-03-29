import findParentNodeByUUIDInTree from "@/utils/tree/findParentNodeByUUIDInTree/findParentNodeByUUIDInTree";
import {
  searchNameInOtherTreeMock,
  simpleTreeMock,
  treeInTreeMock,
  treeInTreeNoNameMock,
} from "@/utils/tree/findParentNodeByUUIDInTree/test/mock";

describe("get Parent Node by name", () => {
  test("Search node in simple tree", () => {
    const { input, output, name } = simpleTreeMock;
    const result = findParentNodeByUUIDInTree(input, name);

    expect(result).toEqual(output);
  });

  test("search Tree in tree", () => {
    const { input, output, name } = treeInTreeMock;
    const result = findParentNodeByUUIDInTree(input, name);

    expect(result).toEqual(output);
  });

  test("search non-existent name in a tree => result null", () => {
    const { input, output, name } = treeInTreeNoNameMock;
    const result = findParentNodeByUUIDInTree(input, name);

    expect(result).toEqual(output);
  });

  test("try to search name in other Tree => result null", () => {
    const { input, output, name } = searchNameInOtherTreeMock;
    const result = findParentNodeByUUIDInTree(input, name);

    expect(result).toEqual(output);
  });
});
