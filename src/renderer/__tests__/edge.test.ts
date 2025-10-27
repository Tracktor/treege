import { describe, expect, it } from "vitest";
import type { ConditionalEdgeData, EdgeCondition } from "@/shared/types/edge";
import type { Flow } from "@/shared/types/node";

describe("Conditional Edge System", () => {
  describe("EdgeCondition Structure", () => {
    it("should have valid condition with all properties", () => {
      const condition: EdgeCondition = {
        field: "age",
        logicalOperator: "AND",
        operator: ">=",
        value: "18",
      };

      expect(condition.field).toBe("age");
      expect(condition.operator).toBe(">=");
      expect(condition.value).toBe("18");
      expect(condition.logicalOperator).toBe("AND");
    });

    it("should support all comparison operators", () => {
      const operators = ["===", "!==", ">", "<", ">=", "<="] as const;

      operators.forEach((op) => {
        const condition: EdgeCondition = {
          field: "value",
          operator: op,
          value: "10",
        };

        expect(condition.operator).toBe(op);
      });
    });

    it("should support AND logical operator", () => {
      const condition: EdgeCondition = {
        field: "field1",
        logicalOperator: "AND",
        operator: "===",
        value: "test",
      };

      expect(condition.logicalOperator).toBe("AND");
    });

    it("should support OR logical operator", () => {
      const condition: EdgeCondition = {
        field: "field1",
        logicalOperator: "OR",
        operator: "===",
        value: "test",
      };

      expect(condition.logicalOperator).toBe("OR");
    });

    it("should allow condition without logical operator (last condition)", () => {
      const condition: EdgeCondition = {
        field: "status",
        operator: "===",
        value: "active",
      };

      expect(condition.logicalOperator).toBeUndefined();
    });
  });

  describe("ConditionalEdgeData Structure", () => {
    it("should have valid conditional edge data", () => {
      const edgeData: ConditionalEdgeData = {
        conditions: [
          {
            field: "age",
            operator: ">=",
            value: "18",
          },
        ],
        label: "Adult Path",
      };

      expect(edgeData.conditions).toBeDefined();
      expect(edgeData.conditions?.length).toBe(1);
      expect(edgeData.label).toBe("Adult Path");
    });

    it("should support multiple conditions with logical operators", () => {
      const edgeData: ConditionalEdgeData = {
        conditions: [
          {
            field: "age",
            logicalOperator: "AND",
            operator: ">=",
            value: "18",
          },
          {
            field: "country",
            operator: "===",
            value: "FR",
          },
        ],
      };

      expect(edgeData.conditions?.length).toBe(2);
      expect(edgeData.conditions?.[0].logicalOperator).toBe("AND");
      expect(edgeData.conditions?.[1].logicalOperator).toBeUndefined();
    });

    it("should support fallback edges", () => {
      const edgeData: ConditionalEdgeData = {
        isFallback: true,
        label: "Default Path",
      };

      expect(edgeData.isFallback).toBe(true);
      expect(edgeData.conditions).toBeUndefined();
    });

    it("should allow empty conditions array", () => {
      const edgeData: ConditionalEdgeData = {
        conditions: [],
      };

      expect(edgeData.conditions).toBeDefined();
      expect(edgeData.conditions?.length).toBe(0);
    });
  });

  describe("Complex Conditional Scenarios", () => {
    it("should support complex AND conditions", () => {
      const edgeData: ConditionalEdgeData = {
        conditions: [
          {
            field: "age",
            logicalOperator: "AND",
            operator: ">=",
            value: "18",
          },
          {
            field: "age",
            logicalOperator: "AND",
            operator: "<=",
            value: "65",
          },
          {
            field: "hasLicense",
            operator: "===",
            value: "true",
          },
        ],
        label: "Eligible Driver",
      };

      expect(edgeData.conditions?.length).toBe(3);
      expect(edgeData.conditions?.every((c, i) => i === 2 || c.logicalOperator === "AND")).toBe(true);
    });

    it("should support complex OR conditions", () => {
      const edgeData: ConditionalEdgeData = {
        conditions: [
          {
            field: "role",
            logicalOperator: "OR",
            operator: "===",
            value: "admin",
          },
          {
            field: "role",
            logicalOperator: "OR",
            operator: "===",
            value: "moderator",
          },
          {
            field: "hasPermission",
            operator: "===",
            value: "true",
          },
        ],
        label: "Access Granted",
      };

      expect(edgeData.conditions?.length).toBe(3);
      expect(edgeData.conditions?.[0].logicalOperator).toBe("OR");
      expect(edgeData.conditions?.[1].logicalOperator).toBe("OR");
      expect(edgeData.conditions?.[2].logicalOperator).toBeUndefined();
    });

    it("should support mixed AND/OR conditions", () => {
      const edgeData: ConditionalEdgeData = {
        conditions: [
          {
            field: "age",
            logicalOperator: "AND",
            operator: ">=",
            value: "18",
          },
          {
            field: "subscription",
            logicalOperator: "OR",
            operator: "===",
            value: "premium",
          },
          {
            field: "subscription",
            operator: "===",
            value: "enterprise",
          },
        ],
        label: "Premium Features",
      };

      expect(edgeData.conditions?.length).toBe(3);
      expect(edgeData.conditions?.[0].logicalOperator).toBe("AND");
      expect(edgeData.conditions?.[1].logicalOperator).toBe("OR");
    });
  });

  describe("Flow with Conditional Edges", () => {
    it("should have flow with conditional and fallback edges", () => {
      const flow: Flow = {
        edges: [
          {
            data: {
              conditions: [
                {
                  field: "node-1",
                  operator: "===",
                  value: "yes",
                },
              ],
              label: "Yes Path",
            },
            id: "edge-1",
            source: "node-1",
            target: "node-2",
            type: "conditional",
          },
          {
            data: {
              isFallback: true,
              label: "No Path",
            },
            id: "edge-2",
            source: "node-1",
            target: "node-3",
            type: "conditional",
          },
        ],
        id: "test-flow",
        nodes: [
          {
            data: {
              label: { en: "Do you agree?" },
              name: "agreement",
              options: [
                { label: { en: "Yes" }, value: "yes" },
                { label: { en: "No" }, value: "no" },
              ],
              type: "radio",
            },
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
          {
            data: { label: { en: "Agreed" }, name: "agreed" },
            id: "node-2",
            position: { x: 100, y: 100 },
            type: "input",
          },
          {
            data: { label: { en: "Disagreed" }, name: "disagreed" },
            id: "node-3",
            position: { x: 100, y: 200 },
            type: "input",
          },
        ],
      };

      expect(flow.edges.length).toBe(2);
      expect(flow.edges[0].type).toBe("conditional");
      expect(flow.edges[0].data?.conditions).toBeDefined();
      expect(flow.edges[1].data?.isFallback).toBe(true);
    });

    it("should support multiple conditional paths from input node", () => {
      const flow: Flow = {
        edges: [
          {
            data: {
              conditions: [{ field: "age-input", operator: "<", value: "18" }],
              label: "Minor",
            },
            id: "edge-1",
            source: "age-input",
            target: "minor-path",
            type: "conditional",
          },
          {
            data: {
              conditions: [
                { field: "age-input", logicalOperator: "AND", operator: ">=", value: "18" },
                { field: "age-input", operator: "<=", value: "65" },
              ],
              label: "Adult",
            },
            id: "edge-2",
            source: "age-input",
            target: "adult-path",
            type: "conditional",
          },
          {
            data: {
              conditions: [{ field: "age-input", operator: ">", value: "65" }],
              label: "Senior",
            },
            id: "edge-3",
            source: "age-input",
            target: "senior-path",
            type: "conditional",
          },
        ],
        id: "age-flow",
        nodes: [
          {
            data: { label: { en: "Enter your age" }, name: "age", type: "number" },
            id: "age-input",
            position: { x: 0, y: 0 },
            type: "input",
          },
          {
            data: { label: { en: "Minor path" }, name: "minor" },
            id: "minor-path",
            position: { x: 100, y: 0 },
            type: "input",
          },
          {
            data: { label: { en: "Adult path" }, name: "adult" },
            id: "adult-path",
            position: { x: 100, y: 100 },
            type: "input",
          },
          {
            data: { label: { en: "Senior path" }, name: "senior" },
            id: "senior-path",
            position: { x: 100, y: 200 },
            type: "input",
          },
        ],
      };

      expect(flow.edges.length).toBe(3);
      expect(flow.edges.every((e) => e.type === "conditional")).toBe(true);
      expect(
        flow.edges.every(
          (e) => (e.data as ConditionalEdgeData | undefined)?.conditions && ((e.data as ConditionalEdgeData).conditions?.length ?? 0) > 0,
        ),
      ).toBe(true);
    });
  });

  describe("Conditional Edge Validation", () => {
    it("should validate that conditions reference existing fields", () => {
      const flow: Flow = {
        edges: [
          {
            data: {
              conditions: [
                {
                  field: "node-1",
                  operator: "===",
                  value: "yes",
                },
              ],
            },
            id: "edge-1",
            source: "node-1",
            target: "node-2",
            type: "conditional",
          },
        ],
        id: "test-flow",
        nodes: [
          {
            data: { label: { en: "Q1" }, name: "q1" },
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
          {
            data: { label: { en: "Q2" }, name: "q2" },
            id: "node-2",
            position: { x: 100, y: 0 },
            type: "input",
          },
        ],
      };

      const edge = flow.edges[0];
      const nodeIds = flow.nodes.map((n) => n.id);
      const conditions = (edge.data as ConditionalEdgeData | undefined)?.conditions;
      const conditionField = conditions?.[0]?.field;

      expect(conditionField).toBeDefined();
      expect(nodeIds).toContain(conditionField);
    });

    it("should allow only one fallback edge per source node", () => {
      const flow: Flow = {
        edges: [
          {
            data: {
              conditions: [{ field: "node-1", operator: "===", value: "a" }],
            },
            id: "edge-1",
            source: "node-1",
            target: "node-2",
            type: "conditional",
          },
          {
            data: {
              isFallback: true,
            },
            id: "edge-2",
            source: "node-1",
            target: "node-3",
            type: "conditional",
          },
        ],
        id: "test-flow",
        nodes: [
          {
            data: { label: { en: "Q1" }, name: "q1" },
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
          {
            data: { label: { en: "Q2" }, name: "q2" },
            id: "node-2",
            position: { x: 100, y: 0 },
            type: "input",
          },
          {
            data: { label: { en: "Q3" }, name: "q3" },
            id: "node-3",
            position: { x: 100, y: 100 },
            type: "input",
          },
        ],
      };

      const fallbackEdges = flow.edges.filter((e) => e.source === "node-1" && e.data?.isFallback === true);

      expect(fallbackEdges.length).toBe(1);
    });
  });

  describe("String Value Comparisons", () => {
    it("should handle empty string values", () => {
      const condition: EdgeCondition = {
        field: "name",
        operator: "===",
        value: "",
      };

      expect(condition.value).toBe("");
    });

    it("should handle whitespace in values", () => {
      const condition: EdgeCondition = {
        field: "name",
        operator: "===",
        value: "  test  ",
      };

      expect(condition.value).toBe("  test  ");
    });

    it("should handle special characters in values", () => {
      const condition: EdgeCondition = {
        field: "email",
        operator: "===",
        value: "user@example.com",
      };

      expect(condition.value).toBe("user@example.com");
    });

    it("should handle numeric strings for comparison", () => {
      const conditions: EdgeCondition[] = [
        { field: "age", operator: ">", value: "18" },
        { field: "score", operator: ">=", value: "75.5" },
        { field: "count", operator: "!==", value: "0" },
      ];

      expect(conditions.every((c) => typeof c.value === "string")).toBe(true);
    });
  });
});
