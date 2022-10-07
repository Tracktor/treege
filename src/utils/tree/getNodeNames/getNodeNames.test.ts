import { expect } from "vitest";
import getNodeNames from "@/utils/tree/getNodeNames/getNodeNames";
import {
  complexeTreeWithMultiDecisionFields,
  treeWithDecisionFields,
  treeWithMultiFields,
  treeWithOneField,
  treeWithTree,
} from "@/utils/tree/getNodeNames/mock";

describe("getNodeNames", () => {
  test("tree With one Field", () => {
    const { input, output } = treeWithOneField;
    const result = getNodeNames(input);

    expect(result.sort()).toEqual(output);
  });

  test("tree With multi Fields", () => {
    const { input, output } = treeWithMultiFields;
    const result = getNodeNames(input);

    expect(result.sort()).toEqual(output);
  });

  test("tree With value decision Fields", () => {
    const { input, output } = treeWithDecisionFields;
    const result = getNodeNames(input);

    expect(result.sort()).toEqual(output);
  });

  test("Complexe tree With multi value decision Fields", () => {
    const { input, output } = complexeTreeWithMultiDecisionFields;
    const result = getNodeNames(input);

    expect(result.sort()).toEqual(output);
  });

  test("tree With tree", () => {
    const { input, output } = treeWithTree;
    const result = getNodeNames(input);

    expect(result.sort()).toEqual(output);
  });
});
