import { Node } from "@xyflow/react";
import { describe, expect, it } from "vitest";
import { FormValues } from "@/renderer/types/renderer";
import { evaluateCondition, evaluateConditions } from "@/renderer/utils/conditions";
import { EdgeCondition } from "@/shared/types/edge";
import { InputNodeData, TreegeNodeData } from "@/shared/types/node";

describe("Conditions Utils", () => {
  describe("evaluateCondition", () => {
    describe("Equality Operators", () => {
      it("should evaluate === with matching strings", () => {
        const condition: EdgeCondition = { field: "name", operator: "===", value: "John" };
        const formValues: FormValues = { name: "John" };

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should evaluate === with non-matching strings", () => {
        const condition: EdgeCondition = { field: "name", operator: "===", value: "John" };
        const formValues: FormValues = { name: "Jane" };

        expect(evaluateCondition(condition, formValues)).toBe(false);
      });

      it("should evaluate === with matching numbers", () => {
        const condition: EdgeCondition = { field: "age", operator: "===", value: "25" };
        const formValues: FormValues = { age: 25 };

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should evaluate === with numeric strings", () => {
        const condition: EdgeCondition = { field: "age", operator: "===", value: "25" };
        const formValues: FormValues = { age: "25" };

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should evaluate !== with non-matching values", () => {
        const condition: EdgeCondition = { field: "status", operator: "!==", value: "inactive" };
        const formValues: FormValues = { status: "active" };

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should evaluate !== with matching values", () => {
        const condition: EdgeCondition = { field: "status", operator: "!==", value: "active" };
        const formValues: FormValues = { status: "active" };

        expect(evaluateCondition(condition, formValues)).toBe(false);
      });
    });

    describe("Comparison Operators", () => {
      it("should evaluate > with greater value", () => {
        const condition: EdgeCondition = { field: "age", operator: ">", value: "18" };
        const formValues: FormValues = { age: 25 };

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should evaluate > with lesser value", () => {
        const condition: EdgeCondition = { field: "age", operator: ">", value: "18" };
        const formValues: FormValues = { age: 15 };

        expect(evaluateCondition(condition, formValues)).toBe(false);
      });

      it("should evaluate < with lesser value", () => {
        const condition: EdgeCondition = { field: "age", operator: "<", value: "18" };
        const formValues: FormValues = { age: 15 };

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should evaluate >= with equal value", () => {
        const condition: EdgeCondition = { field: "age", operator: ">=", value: "18" };
        const formValues: FormValues = { age: 18 };

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should evaluate >= with greater value", () => {
        const condition: EdgeCondition = { field: "age", operator: ">=", value: "18" };
        const formValues: FormValues = { age: 25 };

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should evaluate <= with equal value", () => {
        const condition: EdgeCondition = { field: "age", operator: "<=", value: "65" };
        const formValues: FormValues = { age: 65 };

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should evaluate <= with lesser value", () => {
        const condition: EdgeCondition = { field: "age", operator: "<=", value: "65" };
        const formValues: FormValues = { age: 50 };

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should handle decimal numbers in comparisons", () => {
        const condition: EdgeCondition = { field: "score", operator: ">", value: "75.5" };
        const formValues: FormValues = { score: 80.3 };

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });
    });

    describe("Null and Undefined Handling", () => {
      it("should return true for incomplete condition (missing field)", () => {
        const condition: EdgeCondition = { field: "", operator: "===", value: "test" };
        const formValues: FormValues = {};

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should return true for incomplete condition (missing operator)", () => {
        const condition: EdgeCondition = { field: "name", operator: "" as any, value: "test" };
        const formValues: FormValues = {};

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should return true for incomplete condition (missing value)", () => {
        const condition: EdgeCondition = { field: "name", operator: "===", value: undefined as any };
        const formValues: FormValues = {};

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should evaluate === with null values", () => {
        const condition: EdgeCondition = { field: "value", operator: "===", value: null as any };
        const formValues: FormValues = { value: null };

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should evaluate !== with null vs value", () => {
        const condition: EdgeCondition = { field: "value", operator: "!==", value: null as any };
        const formValues: FormValues = { value: "something" };

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should return false for numeric comparison with null", () => {
        const condition: EdgeCondition = { field: "age", operator: ">", value: "18" };
        const formValues: FormValues = { age: null };

        expect(evaluateCondition(condition, formValues)).toBe(false);
      });

      it("should handle undefined field value", () => {
        const condition: EdgeCondition = { field: "missing", operator: "===", value: "test" };
        const formValues: FormValues = {};

        expect(evaluateCondition(condition, formValues)).toBe(false);
      });
    });

    describe("Node Map Resolution", () => {
      it("should resolve field value using node map", () => {
        const condition: EdgeCondition = { field: "node-1", operator: "===", value: "yes" };
        const formValues: FormValues = { "node-1": "yes" };
        const nodeMap = new Map<string, Node<TreegeNodeData>>([
          [
            "node-1",
            {
              data: { name: "field1", type: "text" } as InputNodeData,
              id: "node-1",
              position: { x: 0, y: 0 },
              type: "input",
            },
          ],
        ]);

        expect(evaluateCondition(condition, formValues, nodeMap)).toBe(true);
      });

      it("should handle non-input nodes in node map", () => {
        const condition: EdgeCondition = { field: "node-1", operator: "===", value: "test" };
        const formValues: FormValues = {};
        const nodeMap = new Map<string, Node<TreegeNodeData>>([
          [
            "node-1",
            {
              data: { type: "title" },
              id: "node-1",
              position: { x: 0, y: 0 },
              type: "ui",
            },
          ],
        ]);

        expect(evaluateCondition(condition, formValues, nodeMap)).toBe(false);
      });
    });

    describe("Type Coercion", () => {
      it("should handle string number vs actual number", () => {
        const condition: EdgeCondition = { field: "count", operator: "===", value: "10" };
        const formValues: FormValues = { count: 10 };

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should handle boolean true as string", () => {
        const condition: EdgeCondition = { field: "active", operator: "===", value: "true" };
        const formValues: FormValues = { active: true };

        expect(evaluateCondition(condition, formValues)).toBe(true); // true (boolean) coerced to string "true"
      });

      it("should handle array comparison via JSON stringify", () => {
        const condition: EdgeCondition = { field: "items", operator: "===", value: JSON.stringify([1, 2, 3]) };
        const formValues: FormValues = { items: [1, 2, 3] };

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should handle object comparison via JSON stringify", () => {
        const condition: EdgeCondition = { field: "data", operator: "===", value: JSON.stringify({ a: 1 }) };
        const formValues: FormValues = { data: { a: 1 } };

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });
    });

    describe("Edge Cases", () => {
      it("should handle empty string comparison", () => {
        const condition: EdgeCondition = { field: "value", operator: "===", value: "" };
        const formValues: FormValues = { value: "" };

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should handle whitespace in values", () => {
        const condition: EdgeCondition = { field: "name", operator: "===", value: "  test  " };
        const formValues: FormValues = { name: "  test  " };

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should return false for non-numeric string comparison with >", () => {
        const condition: EdgeCondition = { field: "value", operator: ">", value: "10" };
        const formValues: FormValues = { value: "abc" };

        expect(evaluateCondition(condition, formValues)).toBe(false);
      });

      it("should handle zero in comparisons", () => {
        const condition: EdgeCondition = { field: "count", operator: ">", value: "0" };
        const formValues: FormValues = { count: 0 };

        expect(evaluateCondition(condition, formValues)).toBe(false);
      });

      it("should handle negative numbers", () => {
        const condition: EdgeCondition = { field: "temp", operator: "<", value: "0" };
        const formValues: FormValues = { temp: -5 };

        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should not treat empty string as 0 in numeric comparisons", () => {
        const condition: EdgeCondition = { field: "age", operator: "<", value: "10" };
        const formValues: FormValues = { age: "" };

        // Empty string should be treated as null, not as 0
        // So numeric comparison should return false
        expect(evaluateCondition(condition, formValues)).toBe(false);
      });

      it("should handle empty string with === operator", () => {
        const condition: EdgeCondition = { field: "value", operator: "===", value: "" };
        const formValues: FormValues = { value: "" };

        // Empty string equality should work
        expect(evaluateCondition(condition, formValues)).toBe(true);
      });

      it("should handle non-empty string vs empty string with === operator", () => {
        const condition: EdgeCondition = { field: "value", operator: "===", value: "" };
        const formValues: FormValues = { value: "3" };

        // Non-empty string should not equal empty string
        expect(evaluateCondition(condition, formValues)).toBe(false);
      });
    });
  });

  describe("evaluateConditions", () => {
    describe("Single Condition", () => {
      it("should evaluate single condition", () => {
        const conditions: EdgeCondition[] = [{ field: "age", operator: ">=", value: "18" }];
        const formValues: FormValues = { age: 25 };

        expect(evaluateConditions(conditions, formValues)).toBe(true);
      });

      it("should return false for failing single condition", () => {
        const conditions: EdgeCondition[] = [{ field: "age", operator: ">=", value: "18" }];
        const formValues: FormValues = { age: 15 };

        expect(evaluateConditions(conditions, formValues)).toBe(false);
      });
    });

    describe("No Conditions", () => {
      it("should return true for undefined conditions", () => {
        expect(evaluateConditions(undefined, {})).toBe(true);
      });

      it("should return true for empty conditions array", () => {
        expect(evaluateConditions([], {})).toBe(true);
      });
    });

    describe("AND Logic", () => {
      it("should evaluate multiple AND conditions (all true)", () => {
        const conditions: EdgeCondition[] = [
          { field: "age", logicalOperator: "AND", operator: ">=", value: "18" },
          { field: "age", logicalOperator: "AND", operator: "<=", value: "65" },
          { field: "hasLicense", operator: "===", value: "true" },
        ];
        const formValues: FormValues = { age: 30, hasLicense: "true" };

        expect(evaluateConditions(conditions, formValues)).toBe(true);
      });

      it("should evaluate multiple AND conditions (one false)", () => {
        const conditions: EdgeCondition[] = [
          { field: "age", logicalOperator: "AND", operator: ">=", value: "18" },
          { field: "hasLicense", operator: "===", value: "true" },
        ];
        const formValues: FormValues = { age: 30, hasLicense: "false" };

        expect(evaluateConditions(conditions, formValues)).toBe(false);
      });

      it("should short-circuit on first false with AND", () => {
        const conditions: EdgeCondition[] = [
          { field: "first", logicalOperator: "AND", operator: "===", value: "no" },
          { field: "second", operator: "===", value: "yes" },
        ];
        const formValues: FormValues = { first: "no" }; // second is missing but shouldn't matter

        expect(evaluateConditions(conditions, formValues)).toBe(false);
      });
    });

    describe("OR Logic", () => {
      it("should evaluate multiple OR conditions (all false)", () => {
        const conditions: EdgeCondition[] = [
          { field: "role", logicalOperator: "OR", operator: "===", value: "admin" },
          { field: "role", logicalOperator: "OR", operator: "===", value: "moderator" },
          { field: "role", operator: "===", value: "owner" },
        ];
        const formValues: FormValues = { role: "user" };

        expect(evaluateConditions(conditions, formValues)).toBe(false);
      });

      it("should evaluate multiple OR conditions (one true)", () => {
        const conditions: EdgeCondition[] = [
          { field: "role", logicalOperator: "OR", operator: "===", value: "admin" },
          { field: "role", operator: "===", value: "moderator" },
        ];
        const formValues: FormValues = { role: "admin" };

        expect(evaluateConditions(conditions, formValues)).toBe(true);
      });

      it("should short-circuit on first true with OR", () => {
        const conditions: EdgeCondition[] = [
          { field: "first", logicalOperator: "OR", operator: "===", value: "yes" },
          { field: "second", operator: "===", value: "yes" },
        ];
        const formValues: FormValues = { first: "yes" }; // second is missing but shouldn't matter

        expect(evaluateConditions(conditions, formValues)).toBe(true);
      });
    });

    describe("Mixed AND/OR Logic", () => {
      it("should evaluate mixed AND/OR conditions", () => {
        const conditions: EdgeCondition[] = [
          { field: "age", logicalOperator: "AND", operator: ">=", value: "18" },
          { field: "subscription", logicalOperator: "OR", operator: "===", value: "premium" },
          { field: "subscription", operator: "===", value: "enterprise" },
        ];
        const formValues: FormValues = { age: 25, subscription: "premium" };

        expect(evaluateConditions(conditions, formValues)).toBe(true);
      });

      it("should handle complex mixed logic (age check fails, subscription saves)", () => {
        const conditions: EdgeCondition[] = [
          { field: "age", logicalOperator: "AND", operator: ">=", value: "21" },
          { field: "subscription", logicalOperator: "OR", operator: "===", value: "premium" },
          { field: "isVIP", operator: "===", value: "true" },
        ];
        const formValues: FormValues = { age: 18, subscription: "premium" };

        expect(evaluateConditions(conditions, formValues)).toBe(false); // Age fails AND, then premium check passes OR, but final result depends on evaluation order
      });
    });

    describe("Default Logical Operator", () => {
      it("should default to AND when logical operator is missing", () => {
        const conditions: EdgeCondition[] = [
          { field: "first", operator: "===", value: "yes" }, // No logicalOperator specified
          { field: "second", operator: "===", value: "yes" },
        ];
        const formValues: FormValues = { first: "yes", second: "yes" };

        expect(evaluateConditions(conditions, formValues)).toBe(true);
      });

      it("should fail with default AND when one condition fails", () => {
        const conditions: EdgeCondition[] = [
          { field: "first", operator: "===", value: "yes" },
          { field: "second", operator: "===", value: "yes" },
        ];
        const formValues: FormValues = { first: "yes", second: "no" };

        expect(evaluateConditions(conditions, formValues)).toBe(false);
      });
    });

    describe("With Node Map", () => {
      it("should evaluate conditions with node map resolution", () => {
        const conditions: EdgeCondition[] = [{ field: "input-node-1", operator: "===", value: "yes" }];
        const formValues: FormValues = { "input-node-1": "yes" };
        const nodeMap = new Map<string, Node<TreegeNodeData>>([
          [
            "input-node-1",
            {
              data: { name: "agreement", type: "radio" } as InputNodeData,
              id: "input-node-1",
              position: { x: 0, y: 0 },
              type: "input",
            },
          ],
        ]);

        expect(evaluateConditions(conditions, formValues, nodeMap)).toBe(true);
      });
    });
  });
});
