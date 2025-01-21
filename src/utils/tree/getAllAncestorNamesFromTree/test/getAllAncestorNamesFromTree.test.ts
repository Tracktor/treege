import getAllAncestorNamesFromTree from "@/utils/tree/getAllAncestorNamesFromTree/getAllAncestorNamesFromTree";
import getAllAncestorNamesFromTreeMock from "@/utils/tree/getAllAncestorNamesFromTree/test/mock";

describe("get Names In Tree", () => {
  test("Get ancestor name without given uuid", () => {
    const result = getAllAncestorNamesFromTree(getAllAncestorNamesFromTreeMock, undefined);

    expect(result).toEqual(["a", "b", "c"]);
  });

  test("Get ancestor name with given uuid", () => {
    const result = getAllAncestorNamesFromTree(getAllAncestorNamesFromTreeMock, ":r2n:");

    expect(result).toEqual(["a", "b"]);
  });
});
