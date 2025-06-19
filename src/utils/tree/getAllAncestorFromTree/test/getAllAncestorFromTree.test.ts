import { getAllAncestorFromTree } from "@/utils/tree";
import getAllAncestorNamesFromTreeMock from "@/utils/tree/getAllAncestorFromTree/test/mock";

describe("getAllAncestorFromTree", () => {
  test("should return empty array when uuid is undefined", () => {
    const result = getAllAncestorFromTree(getAllAncestorNamesFromTreeMock, undefined);

    expect(result).toEqual([]);
  });

  test("should return all ancestors up to the node with given uuid (included)", () => {
    const result = getAllAncestorFromTree(getAllAncestorNamesFromTreeMock, ":r2n:");

    expect(result).toEqual([
      { name: "a", uuid: ":r21:" },
      { name: "b", uuid: ":r2n:" },
    ]);
  });

  test("should return all ancestors up to a leaf node (included)", () => {
    const result = getAllAncestorFromTree(getAllAncestorNamesFromTreeMock, ":r3d:");

    expect(result).toEqual([
      { name: "a", uuid: ":r21:" },
      { name: "b", uuid: ":r2n:" },
      { name: "c", uuid: ":r3d:" },
    ]);
  });

  test("should return all ancestors excluding a specific uuid in the path", () => {
    const result = getAllAncestorFromTree(getAllAncestorNamesFromTreeMock, ":r3d:", ":r2n:");

    expect(result).toEqual([
      { name: "a", uuid: ":r21:" },
      { name: "c", uuid: ":r3d:" },
    ]);
  });

  test("should exclude root node if specified", () => {
    const result = getAllAncestorFromTree(getAllAncestorNamesFromTreeMock, ":r3d:", ":r21:");

    expect(result).toEqual([
      { name: "b", uuid: ":r2n:" },
      { name: "c", uuid: ":r3d:" },
    ]);
  });

  test("should exclude the target node itself if specified", () => {
    const result = getAllAncestorFromTree(getAllAncestorNamesFromTreeMock, ":r3d:", ":r3d:");

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

  test("should return empty array when uuid is at root and excluded", () => {
    const result = getAllAncestorFromTree(getAllAncestorNamesFromTreeMock, ":r21:", ":r21:");

    expect(result).toEqual([]);
  });
});
