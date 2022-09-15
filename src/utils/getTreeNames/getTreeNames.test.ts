import { expect } from "vitest";
import getTreeNames from "@/utils/getTreeNames/getTreeNames";
import {
  complexeTreeWithMultiDecisionFields,
  treeWithDecisionFields,
  treeWithMultiFields,
  treeWithOneField,
} from "@/utils/getTreeNames/mock";

describe("getTreeNames", () => {
  test("Tree With one Field", () => {
    const result = getTreeNames(treeWithOneField);

    expect(result).toEqual(["name"]);
  });

  test("Tree With multi Fields", () => {
    const result = getTreeNames(treeWithMultiFields);

    expect(result).toEqual(["name", "age", "gender"]);
  });

  test("Tree With value decision Fields", () => {
    const result = getTreeNames(treeWithDecisionFields);

    expect(result).toEqual(["name", "age", "mini_excavator_type", "carrycot_type", "materials"]);
  });

  test("Complexe Tree With multi value decision Fields", () => {
    const result = getTreeNames(complexeTreeWithMultiDecisionFields);

    expect(result).toEqual([
      "name",
      "mini_excavator_type",
      "carrycot_10_permission",
      "carrycot_20_permission",
      "carrycot_type",
      "materials",
    ]);
  });
});
