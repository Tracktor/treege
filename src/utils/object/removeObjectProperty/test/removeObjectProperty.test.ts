import { describe, expect } from "vitest";
import { removeObjectProperty } from "../removeObjectProperty";

describe("removeObjectProperty", () => {
  test("remove property to object ", () => {
    const prevObject = { a: "a", b: "b", c: "c" };
    const newObject = removeObjectProperty(prevObject, "b");

    expect(prevObject).toEqual({ a: "a", b: "b", c: "c" });
    expect(newObject).toEqual({ a: "a", c: "c" });
  });
});
