import { Node } from "@xyflow/react";
import { describe, expect, it } from "vitest";
import { FormValues } from "@/renderer/types/renderer";
import { checkFormFieldHasValue, convertFormValuesToNamedFormat, isFieldEmpty } from "@/renderer/utils/form";
import { InputNodeData } from "@/shared/types/node";

describe("Form Utils", () => {
  describe("isFieldEmpty", () => {
    describe("Empty Values", () => {
      it("should return true for undefined", () => {
        expect(isFieldEmpty(undefined)).toBe(true);
      });

      it("should return true for null", () => {
        expect(isFieldEmpty(null)).toBe(true);
      });

      it("should return true for empty string", () => {
        expect(isFieldEmpty("")).toBe(true);
      });

      it("should return true for whitespace-only string", () => {
        expect(isFieldEmpty("   ")).toBe(true);
      });

      it("should return true for empty array", () => {
        expect(isFieldEmpty([])).toBe(true);
      });
    });

    describe("Non-Empty Values", () => {
      it("should return false for non-empty string", () => {
        expect(isFieldEmpty("hello")).toBe(false);
      });

      it("should return false for string with only spaces around text", () => {
        expect(isFieldEmpty("  hello  ")).toBe(false);
      });

      it("should return false for number 0", () => {
        expect(isFieldEmpty(0)).toBe(false);
      });

      it("should return false for boolean false", () => {
        expect(isFieldEmpty(false)).toBe(false);
      });

      it("should return false for boolean true", () => {
        expect(isFieldEmpty(true)).toBe(false);
      });

      it("should return false for array with elements", () => {
        expect(isFieldEmpty([1, 2, 3])).toBe(false);
      });

      it("should return false for object", () => {
        expect(isFieldEmpty({ key: "value" })).toBe(false);
      });

      it("should return false for empty object", () => {
        expect(isFieldEmpty({})).toBe(false);
      });
    });
  });

  describe("checkFormFieldHasValue", () => {
    describe("Has Value", () => {
      it("should return true for non-empty string", () => {
        const formValues: FormValues = { name: "John" };
        expect(checkFormFieldHasValue("name", formValues)).toBe(true);
      });

      it("should return true for number including 0", () => {
        const formValues: FormValues = { age: 0 };
        expect(checkFormFieldHasValue("age", formValues)).toBe(true);
      });

      it("should return true for boolean false", () => {
        const formValues: FormValues = { active: false };
        expect(checkFormFieldHasValue("active", formValues)).toBe(true);
      });

      it("should return true for boolean true", () => {
        const formValues: FormValues = { active: true };
        expect(checkFormFieldHasValue("active", formValues)).toBe(true);
      });

      it("should return true for empty string", () => {
        const formValues: FormValues = { name: "" };
        expect(checkFormFieldHasValue("name", formValues)).toBe(true);
      });

      it("should return true for empty array", () => {
        const formValues: FormValues = { items: [] };
        expect(checkFormFieldHasValue("items", formValues)).toBe(true);
      });
    });

    describe("No Value", () => {
      it("should return false for undefined field", () => {
        const formValues: FormValues = {};
        expect(checkFormFieldHasValue("missing", formValues)).toBe(false);
      });

      it("should return false for null value", () => {
        const formValues: FormValues = { name: null };
        expect(checkFormFieldHasValue("name", formValues)).toBe(false);
      });

      it("should return false for undefined fieldName", () => {
        const formValues: FormValues = { name: "John" };
        expect(checkFormFieldHasValue(undefined, formValues)).toBe(false);
      });

      it("should return false for empty string fieldName", () => {
        const formValues: FormValues = { name: "John" };
        expect(checkFormFieldHasValue("", formValues)).toBe(false);
      });
    });

    describe("Edge Cases", () => {
      it("should handle numeric field names", () => {
        const formValues: FormValues = { "123": "value" };
        expect(checkFormFieldHasValue("123", formValues)).toBe(true);
      });

      it("should handle field names with special characters", () => {
        const formValues: FormValues = { "field-name": "value" };
        expect(checkFormFieldHasValue("field-name", formValues)).toBe(true);
      });

      it("should distinguish between undefined and null", () => {
        const formValues: FormValues = { defined: null };
        expect(checkFormFieldHasValue("defined", formValues)).toBe(false);
        expect(checkFormFieldHasValue("undefined", formValues)).toBe(false);
      });
    });
  });

  describe("convertFormValuesToNamedFormat", () => {
    describe("Basic Conversion", () => {
      it("should convert node IDs to field names", () => {
        const formValues: FormValues = {
          "node-1": "Alice",
          "node-2": "Bob",
        };
        const nodes: Node<InputNodeData>[] = [
          {
            data: { name: "firstName", type: "text" },
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
          {
            data: { name: "lastName", type: "text" },
            id: "node-2",
            position: { x: 100, y: 0 },
            type: "input",
          },
        ];

        const result = convertFormValuesToNamedFormat(formValues, nodes);

        expect(result).toEqual({
          firstName: "Alice",
          lastName: "Bob",
        });
      });

      it("should use node ID as fallback when name is missing", () => {
        const formValues: FormValues = {
          "node-1": "value",
        };
        const nodes: Node<InputNodeData>[] = [
          {
            data: { type: "text" } as InputNodeData,
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
        ];

        const result = convertFormValuesToNamedFormat(formValues, nodes);

        expect(result).toEqual({
          "node-1": "value",
        });
      });

      it("should skip nodes without values in formValues", () => {
        const formValues: FormValues = {
          "node-1": "Alice",
        };
        const nodes: Node<InputNodeData>[] = [
          {
            data: { name: "firstName", type: "text" },
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
          {
            data: { name: "lastName", type: "text" },
            id: "node-2",
            position: { x: 100, y: 0 },
            type: "input",
          },
        ];

        const result = convertFormValuesToNamedFormat(formValues, nodes);

        expect(result).toEqual({
          firstName: "Alice",
        });
        expect(result).not.toHaveProperty("lastName");
      });
    });

    describe("Duplicate Names", () => {
      it("should overwrite earlier values with later ones for duplicate names", () => {
        const formValues: FormValues = {
          "node-1": "First",
          "node-2": "Second",
        };
        const nodes: Node<InputNodeData>[] = [
          {
            data: { name: "value", type: "text" },
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
          {
            data: { name: "value", type: "text" },
            id: "node-2",
            position: { x: 100, y: 0 },
            type: "input",
          },
        ];

        const result = convertFormValuesToNamedFormat(formValues, nodes);

        expect(result).toEqual({
          value: "Second",
        });
      });
    });

    describe("Value Types", () => {
      it("should preserve string values", () => {
        const formValues: FormValues = { "node-1": "text" };
        const nodes: Node<InputNodeData>[] = [
          {
            data: { name: "field", type: "text" },
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
        ];

        const result = convertFormValuesToNamedFormat(formValues, nodes);

        expect(result.field).toBe("text");
      });

      it("should preserve number values", () => {
        const formValues: FormValues = { "node-1": 42 };
        const nodes: Node<InputNodeData>[] = [
          {
            data: { name: "age", type: "number" },
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
        ];

        const result = convertFormValuesToNamedFormat(formValues, nodes);

        expect(result.age).toBe(42);
      });

      it("should preserve boolean values", () => {
        const formValues: FormValues = { "node-1": true };
        const nodes: Node<InputNodeData>[] = [
          {
            data: { name: "active", type: "checkbox" },
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
        ];

        const result = convertFormValuesToNamedFormat(formValues, nodes);

        expect(result.active).toBe(true);
      });

      it("should preserve array values", () => {
        const formValues: FormValues = { "node-1": ["a", "b", "c"] };
        const nodes: Node<InputNodeData>[] = [
          {
            data: { name: "items", type: "select" },
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
        ];

        const result = convertFormValuesToNamedFormat(formValues, nodes);

        expect(result.items).toEqual(["a", "b", "c"]);
      });

      it("should preserve object values", () => {
        const formValues: FormValues = { "node-1": { nested: "value" } };
        const nodes: Node<InputNodeData>[] = [
          {
            data: { name: "data", type: "http" },
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
        ];

        const result = convertFormValuesToNamedFormat(formValues, nodes);

        expect(result.data).toEqual({ nested: "value" });
      });

      it("should handle zero, false, and empty string as valid values", () => {
        const formValues: FormValues = {
          "node-1": 0,
          "node-2": false,
          "node-3": "",
        };
        const nodes: Node<InputNodeData>[] = [
          {
            data: { name: "count", type: "number" },
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
          {
            data: { name: "active", type: "checkbox" },
            id: "node-2",
            position: { x: 100, y: 0 },
            type: "input",
          },
          {
            data: { name: "name", type: "text" },
            id: "node-3",
            position: { x: 200, y: 0 },
            type: "input",
          },
        ];

        const result = convertFormValuesToNamedFormat(formValues, nodes);

        expect(result).toEqual({
          active: false,
          count: 0,
          name: "",
        });
      });
    });

    describe("Empty Cases", () => {
      it("should return empty object for empty nodes array", () => {
        const formValues: FormValues = { "node-1": "value" };
        const nodes: Node<InputNodeData>[] = [];

        const result = convertFormValuesToNamedFormat(formValues, nodes);

        expect(result).toEqual({});
      });

      it("should return empty object for empty formValues", () => {
        const formValues: FormValues = {};
        const nodes: Node<InputNodeData>[] = [
          {
            data: { name: "field", type: "text" },
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
        ];

        const result = convertFormValuesToNamedFormat(formValues, nodes);

        expect(result).toEqual({});
      });

      it("should return empty object when both are empty", () => {
        const result = convertFormValuesToNamedFormat({}, []);

        expect(result).toEqual({});
      });
    });
  });
});
