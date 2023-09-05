import { expect } from "vitest";
import { isUniqueArrayItem } from "@/utils/array";

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
