import { expect } from "vitest";
import removeObjectProperty from "@/utils/removeObjectProperty";

test("remove object property", () => {
  const prevObject = { a: "a", b: "b", c: "c" };
  const newObject = removeObjectProperty(prevObject, "b");

  expect(prevObject).toEqual({ a: "a", b: "b", c: "c" });
  expect(newObject).toEqual({ a: "a", c: "c" });
});
