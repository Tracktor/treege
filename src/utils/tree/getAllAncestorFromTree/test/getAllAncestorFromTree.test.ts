import { getAllAncestorFromTree } from "@/utils/tree";
import getAllAncestorNamesFromTreeMock from "@/utils/tree/getAllAncestorFromTree/test/mock";

describe("getAllAncestorFromTree", () => {
  test("should return empty array when uuid is undefined", () => {
    const result = getAllAncestorFromTree(getAllAncestorNamesFromTreeMock, undefined);

    expect(result).toEqual([]);
  });

  test("should return all ancestors up to the node with given uuid", () => {
    const result = getAllAncestorFromTree(getAllAncestorNamesFromTreeMock, ":r2n:");

    expect(result).toEqual([{ name: "a", uuid: ":r21:" }]);
  });

  test("should return all ancestors up to a leaf node", () => {
    const result = getAllAncestorFromTree(getAllAncestorNamesFromTreeMock, ":r3d:");

    expect(result).toEqual([
      { name: "a", uuid: ":r21:" },
      { name: "b", uuid: ":r2n:" },
    ]);
  });

  test("should return empty array when tree is null", () => {
    const result = getAllAncestorFromTree(null, ":r2n:");

    expect(result).toEqual([]);
  });

  test("should return empty array when uuid is not found", () => {
    const result = getAllAncestorFromTree(getAllAncestorNamesFromTreeMock, ":notfound:");

    expect(result).toEqual([]);
  });
});
