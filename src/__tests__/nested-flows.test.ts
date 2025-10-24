import { describe, expect, it } from "vitest";
import type { Flow, FlowNodeData } from "@/shared/types/node";
import combinedFlow from "./mocks/nested-test-combined.json";
import flowA from "./mocks/nested-test-flow-a.json";
import flowB from "./mocks/nested-test-flow-b.json";
import flowC from "./mocks/nested-test-flow-c.json";

describe("Nested Flows - Example JSON Files", () => {
  describe("Flow A (Main Flow)", () => {
    it("should have correct structure", () => {
      const flow = flowA as Flow;

      expect(flow).toHaveProperty("id");
      expect(flow).toHaveProperty("nodes");
      expect(flow).toHaveProperty("edges");
      expect(flow.id).toBe("flow-a-main");
    });

    it("should have correct nodes", () => {
      const flow = flowA as Flow;

      expect(flow.nodes).toHaveLength(4);

      const nodeA1 = flow.nodes.find((n) => n.id === "node-a1");
      expect(nodeA1).toBeDefined();
      expect(nodeA1?.type).toBe("input");
      expect(nodeA1?.data.name).toBe("question-a1");

      const nodeA2 = flow.nodes.find((n) => n.id === "node-a2");
      expect(nodeA2).toBeDefined();
      expect(nodeA2?.type).toBe("input");

      const flowNodeToB = flow.nodes.find((n) => n.id === "flow-node-to-b");
      expect(flowNodeToB).toBeDefined();
      expect(flowNodeToB?.type).toBe("flow");
      expect(flowNodeToB?.data.targetId).toBe("flow-b-middle");

      const nodeA3 = flow.nodes.find((n) => n.id === "node-a3");
      expect(nodeA3).toBeDefined();
      expect(nodeA3?.type).toBe("input");
    });

    it("should have correct edges", () => {
      const flow = flowA as Flow;

      expect(flow.edges).toHaveLength(3);

      const edgeA1A2 = flow.edges.find((e) => e.id === "edge-a1-a2");
      expect(edgeA1A2).toBeDefined();
      expect(edgeA1A2?.source).toBe("node-a1");
      expect(edgeA1A2?.target).toBe("node-a2");

      const edgeA2FlowB = flow.edges.find((e) => e.id === "edge-a2-flow-b");
      expect(edgeA2FlowB).toBeDefined();
      expect(edgeA2FlowB?.source).toBe("node-a2");
      expect(edgeA2FlowB?.target).toBe("flow-node-to-b");

      const edgeFlowBA3 = flow.edges.find((e) => e.id === "edge-flow-b-a3");
      expect(edgeFlowBA3).toBeDefined();
      expect(edgeFlowBA3?.source).toBe("flow-node-to-b");
      expect(edgeFlowBA3?.target).toBe("node-a3");
    });

    it("should have unique node IDs", () => {
      const flow = flowA as Flow;
      const nodeIds = flow.nodes.map((n) => n.id);
      const uniqueIds = new Set(nodeIds);
      expect(uniqueIds.size).toBe(nodeIds.length);
    });

    it("should have unique edge IDs", () => {
      const flow = flowA as Flow;
      const edgeIds = flow.edges.map((e) => e.id);
      const uniqueIds = new Set(edgeIds);
      expect(uniqueIds.size).toBe(edgeIds.length);
    });

    it("should have valid edge connections", () => {
      const flow = flowA as Flow;
      const nodeIds = flow.nodes.map((n) => n.id);

      flow.edges.forEach((edge) => {
        expect(nodeIds).toContain(edge.source);
        expect(nodeIds).toContain(edge.target);
      });
    });
  });

  describe("Flow B (Middle Flow)", () => {
    it("should have correct structure", () => {
      const flow = flowB as Flow;

      expect(flow).toHaveProperty("id");
      expect(flow).toHaveProperty("nodes");
      expect(flow).toHaveProperty("edges");
      expect(flow.id).toBe("flow-b-middle");
    });

    it("should have correct nodes including nested flow to C", () => {
      const flow = flowB as Flow;

      expect(flow.nodes.length).toBeGreaterThan(0);

      const nodeB1 = flow.nodes.find((n) => n.id === "node-b1");
      expect(nodeB1).toBeDefined();
      expect(nodeB1?.type).toBe("input");

      const flowNodeToC = flow.nodes.find((n) => n.id === "flow-node-to-c");
      expect(flowNodeToC).toBeDefined();
      expect(flowNodeToC?.type).toBe("flow");
      expect(flowNodeToC?.data.targetId).toBe("flow-c-deepest");

      const nodeB2 = flow.nodes.find((n) => n.id === "node-b2");
      expect(nodeB2).toBeDefined();
      expect(nodeB2?.type).toBe("input");
    });

    it("should reference Flow C", () => {
      const flow = flowB as Flow;
      const flowNodes = flow.nodes.filter((n) => n.type === "flow");

      expect(flowNodes.length).toBeGreaterThan(0);
      const hasFlowC = flowNodes.some((n) => n.data.targetId === "flow-c-deepest");
      expect(hasFlowC).toBe(true);
    });
  });

  describe("Flow C (Inner Flow)", () => {
    it("should have correct structure", () => {
      const flow = flowC as Flow;

      expect(flow).toHaveProperty("id");
      expect(flow).toHaveProperty("nodes");
      expect(flow).toHaveProperty("edges");
      expect(flow.id).toBe("flow-c-deepest");
    });

    it("should have input nodes only (no nested flows)", () => {
      const flow = flowC as Flow;

      expect(flow.nodes.length).toBeGreaterThan(0);

      const nodeC1 = flow.nodes.find((n) => n.id === "node-c1");
      expect(nodeC1).toBeDefined();
      expect(nodeC1?.type).toBe("input");

      const nodeC2 = flow.nodes.find((n) => n.id === "node-c2");
      expect(nodeC2).toBeDefined();
      expect(nodeC2?.type).toBe("input");

      // Flow C should not have any flow nodes (it's the innermost flow)
      const flowNodes = flow.nodes.filter((n) => n.type === "flow");
      expect(flowNodes.length).toBe(0);
    });
  });

  describe("Combined Flow", () => {
    it("should have correct structure with all flows", () => {
      const flows = combinedFlow as Flow[];

      expect(Array.isArray(flows)).toBe(true);
      expect(flows.length).toBe(3);
    });

    it("should contain all three flows", () => {
      const flows = combinedFlow as Flow[];

      const flowIds = flows.map((f) => f.id);
      expect(flowIds).toContain("flow-a-main");
      expect(flowIds).toContain("flow-b-middle");
      expect(flowIds).toContain("flow-c-deepest");
    });

    it("should have valid flow references", () => {
      const flows = combinedFlow as Flow[];
      const flowIds = flows.map((f) => f.id);

      flows.forEach((flow) => {
        const flowNodes = flow.nodes.filter((n) => n.type === "flow");

        flowNodes.forEach((flowNode) => {
          const targetId = flowNode.data.targetId;
          expect(targetId).toBeDefined();
          expect(flowIds).toContain(targetId);
        });
      });
    });

    it("should have correct nesting hierarchy", () => {
      const flows = combinedFlow as Flow[];

      const flowA = flows.find((f) => f.id === "flow-a-main");
      const flowB = flows.find((f) => f.id === "flow-b-middle");
      const flowC = flows.find((f) => f.id === "flow-c-deepest");

      expect(flowA).toBeDefined();
      expect(flowB).toBeDefined();
      expect(flowC).toBeDefined();

      // Flow A references Flow B
      const flowAToB = flowA?.nodes.find((n) => n.type === "flow" && n.data.targetId === "flow-b-middle");
      expect(flowAToB).toBeDefined();

      // Flow B references Flow C
      const flowBToC = flowB?.nodes.find((n) => n.type === "flow" && n.data.targetId === "flow-c-deepest");
      expect(flowBToC).toBeDefined();

      // Flow C doesn't reference any other flow (innermost)
      const flowCNodes = flowC?.nodes.filter((n) => n.type === "flow");
      expect(flowCNodes?.length).toBe(0);
    });

    it("should not have circular references", () => {
      const flows = combinedFlow as Flow[];

      const getFlowReferences = (flowId: string, visited: Set<string> = new Set()): boolean => {
        if (visited.has(flowId)) {
          return true; // Circular reference detected
        }

        visited.add(flowId);

        const flow = flows.find((f) => f.id === flowId);
        if (!flow) {
          return false;
        }

        const flowNodes = flow.nodes.filter((n) => n.type === "flow");

        for (const flowNode of flowNodes) {
          if (flowNode.type === "flow") {
            const nodeData = flowNode.data as FlowNodeData;
            const targetId = nodeData.targetId;
            if (targetId && getFlowReferences(targetId, new Set(visited))) {
              return true;
            }
          }
        }

        return false;
      };

      flows.forEach((flow) => {
        const hasCircular = getFlowReferences(flow.id);
        expect(hasCircular).toBe(false);
      });
    });

    it("should have all nodes with valid positions", () => {
      const flows = combinedFlow as Flow[];

      flows.forEach((flow) => {
        flow.nodes.forEach((node) => {
          expect(node.position).toBeDefined();
          expect(node.position).toHaveProperty("x");
          expect(node.position).toHaveProperty("y");
          expect(typeof node.position.x).toBe("number");
          expect(typeof node.position.y).toBe("number");
        });
      });
    });
  });

  describe("Flow Execution Order", () => {
    it("should maintain correct execution order: A -> B -> C -> B -> A", () => {
      const flows = combinedFlow as Flow[];

      const executionPath: string[] = [];
      const visited = new Set<string>();

      const traverseFlow = (flowId: string) => {
        if (visited.has(flowId)) {
          return;
        }
        visited.add(flowId);
        executionPath.push(flowId);

        const flow = flows.find((f) => f.id === flowId);
        if (!flow) {
          return;
        }

        const flowNodes = flow.nodes.filter((n) => n.type === "flow");
        flowNodes.forEach((flowNode) => {
          if (flowNode.type === "flow") {
            const nodeData = flowNode.data as FlowNodeData;
            const targetId = nodeData.targetId;

            if (targetId) {
              traverseFlow(targetId);
            }
          }
        });
      };

      traverseFlow("flow-a-main");

      expect(executionPath).toEqual(["flow-a-main", "flow-b-middle", "flow-c-deepest"]);
    });
  });

  describe("Input Field Names", () => {
    it("should have unique input field names within each flow", () => {
      const flows = combinedFlow as Flow[];

      flows.forEach((flow) => {
        const inputNodes = flow.nodes.filter((n) => n.type === "input");
        const names = inputNodes.map((n) => n.data.name).filter((name) => name !== undefined);
        const uniqueNames = new Set(names);

        expect(uniqueNames.size).toBe(names.length);
      });
    });

    it("should have unique input field names across all flows", () => {
      const flows = combinedFlow as Flow[];

      const allNames: string[] = [];

      flows.forEach((flow) => {
        const inputNodes = flow.nodes.filter((n) => n.type === "input");
        const names = inputNodes.map((n) => n.data.name).filter((name) => name !== undefined) as string[];
        allNames.push(...names);
      });

      const uniqueNames = new Set(allNames);
      expect(uniqueNames.size).toBe(allNames.length);
    });
  });
});
