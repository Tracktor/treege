import { expect } from "vitest";
import getNodeTags from "@/utils/tree/getNodeTags/getNodeTags";
import { treeWithMultiAndSameTag, treeWithMultiSameTag, treeWithMultiTag, treeWithOneTag } from "@/utils/tree/getNodeTags/test/mock";

describe("getNodeTags", () => {
  test("tree With one Tag", () => {
    const { input, output } = treeWithOneTag;
    const result = getNodeTags(input);

    expect(result.sort()).toEqual(output);
  });

  test("tree With multiple same Tags", () => {
    const { input, output } = treeWithMultiSameTag;
    const result = getNodeTags(input);

    expect(result.sort()).toEqual(output);
  });

  test("tree With multiple Tags", () => {
    const { input, output } = treeWithMultiTag;
    const result = getNodeTags(input);

    expect(result.sort()).toEqual(output);
  });

  test("tree With multiple and same Tags", () => {
    const { input, output } = treeWithMultiAndSameTag;
    const result = getNodeTags(input);

    expect(result.sort()).toEqual(output);
  });
});
