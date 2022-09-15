import { expect } from "vitest";
import { isUniqueArrayItem, isUniqueArrayItemWithNewEntry } from "@/utils/array";

describe("isUniqueArrayItem", () => {
  test("Array With unique name", () => {
    const array = ["name", "age", "gender"];
    const result = isUniqueArrayItem(array);
    expect(result).toEqual(true);
  });

  test("Array With duplicate name", () => {
    const array = ["name", "age", "gender", "age"];
    const result = isUniqueArrayItem(array);
    expect(result).toEqual(false);
  });

  test("Array With multi duplicate name", () => {
    const array = ["name", "age", "gender", "age", "age"];
    const result = isUniqueArrayItem(array);
    expect(result).toEqual(false);
  });
});

describe("isUniqueArrayItemWithNewEntry", () => {
  test("add name no exist", () => {
    const array = ["name", "age"];
    const name = "gender";
    const result = isUniqueArrayItemWithNewEntry(array, name);
    expect(result).toEqual(true);
  });

  test("add name no exist", () => {
    const array = ["name", "age"];
    const name = "age";
    const result = isUniqueArrayItemWithNewEntry(array, name);
    expect(result).toEqual(false);
  });
});
