import getUniqueTagsInTree from "@/utils/tree/getUniqueTagsInTree/getUniqueTagsInTree";
import {
  treeWithMultiAndSameTag,
  treeWithMultiSameTag,
  treeWithMultiTag,
  treeWithOneTag,
} from "@/utils/tree/getUniqueTagsInTree/test/mock";

describe("get Unique Tags In Tree", () => {
  test("tree With one Tag", () => {
    const { input, output } = treeWithOneTag;
    const result = getUniqueTagsInTree(input);

    expect(result.sort()).toEqual(output);
  });

  test("tree With multiple same Tags", () => {
    const { input, output } = treeWithMultiSameTag;
    const result = getUniqueTagsInTree(input);

    expect(result.sort()).toEqual(output);
  });

  test("tree With multiple Tags", () => {
    const { input, output } = treeWithMultiTag;
    const result = getUniqueTagsInTree(input);

    expect(result.sort()).toEqual(output);
  });

  test("tree With multiple and same Tags", () => {
    const { input, output } = treeWithMultiAndSameTag;
    const result = getUniqueTagsInTree(input);

    expect(result.sort()).toEqual(output);
  });
});
