import { isUniqueArrayItemWithNewEntry } from "@/utils/array";

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

  test("edit name with unique name", () => {
    const array = ["name", "gender"];
    const name = "age";
    const currentName = "gender";

    const result = isUniqueArrayItemWithNewEntry(array, name, currentName);
    expect(result).toEqual(true);
  });

  test("edit name with same name editable", () => {
    const array = ["name", "gender"];
    const name = "gender";
    const currentName = "gender";

    const result = isUniqueArrayItemWithNewEntry(array, name, currentName);
    expect(result).toEqual(true);
  });

  test("edit name with name exist in tree", () => {
    const array = ["name", "gender"];
    const name = "name";
    const currentName = "gender";

    const result = isUniqueArrayItemWithNewEntry(array, name, currentName);
    expect(result).toEqual(false);
  });
});
