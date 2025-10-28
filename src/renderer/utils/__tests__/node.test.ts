import { Node } from "@xyflow/react";
import { describe, expect, it } from "vitest";
import { getFieldNameFromNodeId, getInputNodes } from "@/renderer/utils/node";
import { InputNodeData, TreegeNodeData, UINodeData } from "@/shared/types/node";

describe("Node Utils", () => {
  describe("getInputNodes", () => {
    it("should filter only input nodes", () => {
      const nodes: Node<TreegeNodeData>[] = [
        {
          data: { name: "name", type: "text" } as InputNodeData,
          id: "input-1",
          position: { x: 0, y: 0 },
          type: "input",
        },
        {
          data: { type: "title" } as UINodeData,
          id: "ui-1",
          position: { x: 100, y: 0 },
          type: "ui",
        },
        {
          data: { name: "email", type: "text" } as InputNodeData,
          id: "input-2",
          position: { x: 200, y: 0 },
          type: "input",
        },
      ];

      const inputNodes = getInputNodes(nodes);

      expect(inputNodes).toHaveLength(2);
      expect(inputNodes[0].id).toBe("input-1");
      expect(inputNodes[1].id).toBe("input-2");
    });

    it("should return empty array when no input nodes", () => {
      const nodes: Node<TreegeNodeData>[] = [
        {
          data: { type: "title" } as UINodeData,
          id: "ui-1",
          position: { x: 0, y: 0 },
          type: "ui",
        },
      ];

      const inputNodes = getInputNodes(nodes);

      expect(inputNodes).toHaveLength(0);
    });

    it("should handle empty nodes array", () => {
      const inputNodes = getInputNodes([]);

      expect(inputNodes).toHaveLength(0);
    });

    it("should return all nodes when all are input nodes", () => {
      const nodes: Node<TreegeNodeData>[] = [
        {
          data: { name: "field1", type: "text" } as InputNodeData,
          id: "input-1",
          position: { x: 0, y: 0 },
          type: "input",
        },
        {
          data: { name: "field2", type: "number" } as InputNodeData,
          id: "input-2",
          position: { x: 100, y: 0 },
          type: "input",
        },
        {
          data: { name: "field3", type: "checkbox" } as InputNodeData,
          id: "input-3",
          position: { x: 200, y: 0 },
          type: "input",
        },
      ];

      const inputNodes = getInputNodes(nodes);

      expect(inputNodes).toHaveLength(3);
    });

    it("should preserve node order", () => {
      const nodes: Node<TreegeNodeData>[] = [
        {
          data: { name: "first", type: "text" } as InputNodeData,
          id: "input-1",
          position: { x: 0, y: 0 },
          type: "input",
        },
        {
          data: { type: "divider" } as UINodeData,
          id: "ui-1",
          position: { x: 100, y: 0 },
          type: "ui",
        },
        {
          data: { name: "second", type: "text" } as InputNodeData,
          id: "input-2",
          position: { x: 200, y: 0 },
          type: "input",
        },
      ];

      const inputNodes = getInputNodes(nodes);

      expect(inputNodes[0].data.name).toBe("first");
      expect(inputNodes[1].data.name).toBe("second");
    });
  });

  describe("getFieldNameFromNodeId", () => {
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
      {
        data: { type: "text" } as InputNodeData, // No name specified
        id: "node-3",
        position: { x: 200, y: 0 },
        type: "input",
      },
    ];

    describe("Normal Cases", () => {
      it("should return field name when node exists", () => {
        const fieldName = getFieldNameFromNodeId("node-1", nodes);

        expect(fieldName).toBe("firstName");
      });

      it("should return different field name for different node", () => {
        const fieldName = getFieldNameFromNodeId("node-2", nodes);

        expect(fieldName).toBe("lastName");
      });
    });

    describe("Fallback to Node ID", () => {
      it("should return node ID when name is not specified", () => {
        const fieldName = getFieldNameFromNodeId("node-3", nodes);

        expect(fieldName).toBe("node-3");
      });

      it("should return node ID when name is empty string", () => {
        const nodesWithEmpty: Node<InputNodeData>[] = [
          {
            data: { name: "", type: "text" },
            id: "node-empty",
            position: { x: 0, y: 0 },
            type: "input",
          },
        ];

        const fieldName = getFieldNameFromNodeId("node-empty", nodesWithEmpty);

        expect(fieldName).toBe("node-empty");
      });
    });

    describe("Node Not Found", () => {
      it("should return undefined when node ID does not exist", () => {
        const fieldName = getFieldNameFromNodeId("non-existent", nodes);

        expect(fieldName).toBeUndefined();
      });

      it("should return undefined for empty string node ID", () => {
        const fieldName = getFieldNameFromNodeId("", nodes);

        expect(fieldName).toBeUndefined();
      });
    });

    describe("Empty Cases", () => {
      it("should return undefined when nodes array is empty", () => {
        const fieldName = getFieldNameFromNodeId("node-1", []);

        expect(fieldName).toBeUndefined();
      });
    });

    describe("Special Characters", () => {
      it("should handle field names with special characters", () => {
        const specialNodes: Node<InputNodeData>[] = [
          {
            data: { name: "field-with-dashes_and_underscores", type: "text" },
            id: "node-special",
            position: { x: 0, y: 0 },
            type: "input",
          },
        ];

        const fieldName = getFieldNameFromNodeId("node-special", specialNodes);

        expect(fieldName).toBe("field-with-dashes_and_underscores");
      });

      it("should handle numeric field names", () => {
        const numericNodes: Node<InputNodeData>[] = [
          {
            data: { name: "123", type: "text" },
            id: "node-numeric",
            position: { x: 0, y: 0 },
            type: "input",
          },
        ];

        const fieldName = getFieldNameFromNodeId("node-numeric", numericNodes);

        expect(fieldName).toBe("123");
      });

      it("should handle field names with spaces", () => {
        const spaceNodes: Node<InputNodeData>[] = [
          {
            data: { name: "field with spaces", type: "text" },
            id: "node-space",
            position: { x: 0, y: 0 },
            type: "input",
          },
        ];

        const fieldName = getFieldNameFromNodeId("node-space", spaceNodes);

        expect(fieldName).toBe("field with spaces");
      });
    });

    describe("Multiple Nodes", () => {
      it("should find correct node among many", () => {
        const manyNodes: Node<InputNodeData>[] = Array.from({ length: 100 }, (_, i) => ({
          data: { name: `field${i}`, type: "text" },
          id: `node-${i}`,
          position: { x: i * 100, y: 0 },
          type: "input",
        }));

        const fieldName = getFieldNameFromNodeId("node-50", manyNodes);

        expect(fieldName).toBe("field50");
      });

      it("should handle duplicate names (returns first match)", () => {
        const duplicateNodes: Node<InputNodeData>[] = [
          {
            data: { name: "duplicateName", type: "text" },
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
          {
            data: { name: "duplicateName", type: "text" },
            id: "node-2",
            position: { x: 100, y: 0 },
            type: "input",
          },
        ];

        const fieldName1 = getFieldNameFromNodeId("node-1", duplicateNodes);
        const fieldName2 = getFieldNameFromNodeId("node-2", duplicateNodes);

        expect(fieldName1).toBe("duplicateName");
        expect(fieldName2).toBe("duplicateName");
      });
    });
  });
});
