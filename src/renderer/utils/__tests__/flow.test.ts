import { Edge, Node } from "@xyflow/react";
import { describe, expect, it } from "vitest";
import { findStartNode, getFlowRenderState, isStartNode, mergeFlows } from "@/renderer/utils/flow";
import { ConditionalEdgeData } from "@/shared/types/edge";
import { Flow, FlowNodeData, InputNodeData, TreegeNodeData, UINodeData } from "@/shared/types/node";

describe("Flow Utils", () => {
  describe("isStartNode", () => {
    it("should return true for node without incoming edges", () => {
      const edges: Edge[] = [
        { id: "e1", source: "node-1", target: "node-2" },
        { id: "e2", source: "node-2", target: "node-3" },
      ];

      expect(isStartNode("node-1", edges)).toBe(true);
    });

    it("should return false for node with incoming edge", () => {
      const edges: Edge[] = [
        { id: "e1", source: "node-1", target: "node-2" },
        { id: "e2", source: "node-2", target: "node-3" },
      ];

      expect(isStartNode("node-2", edges)).toBe(false);
    });

    it("should return true for isolated node", () => {
      const edges: Edge[] = [];

      expect(isStartNode("node-1", edges)).toBe(true);
    });
  });

  describe("findStartNode", () => {
    it("should find input node as start when multiple candidates", () => {
      const nodes: Node<TreegeNodeData>[] = [
        {
          data: { type: "title" } as UINodeData,
          id: "ui-1",
          position: { x: 0, y: 0 },
          type: "ui",
        },
        {
          data: { name: "name", type: "text" } as InputNodeData,
          id: "input-1",
          position: { x: 100, y: 0 },
          type: "input",
        },
      ];
      const edges: Edge[] = [];

      const startNode = findStartNode(nodes, edges);
      expect(startNode?.id).toBe("input-1");
    });

    it("should find first node when no input nodes", () => {
      const nodes: Node<TreegeNodeData>[] = [
        {
          data: { type: "title" } as UINodeData,
          id: "ui-1",
          position: { x: 0, y: 0 },
          type: "ui",
        },
      ];
      const edges: Edge[] = [];

      const startNode = findStartNode(nodes, edges);
      expect(startNode?.id).toBe("ui-1");
    });

    it("should return undefined for empty nodes array", () => {
      const startNode = findStartNode([], []);
      expect(startNode).toBeUndefined();
    });

    it("should find node without incoming edges", () => {
      const nodes: Node<TreegeNodeData>[] = [
        {
          data: { name: "first", type: "text" } as InputNodeData,
          id: "node-1",
          position: { x: 0, y: 0 },
          type: "input",
        },
        {
          data: { name: "second", type: "text" } as InputNodeData,
          id: "node-2",
          position: { x: 100, y: 0 },
          type: "input",
        },
      ];
      const edges: Edge[] = [{ id: "e1", source: "node-1", target: "node-2" }];

      const startNode = findStartNode(nodes, edges);
      expect(startNode?.id).toBe("node-1");
    });
  });

  describe("getFlowRenderState", () => {
    describe("Empty Flow", () => {
      it("should handle empty nodes array", () => {
        const state = getFlowRenderState([], [], {});

        expect(state.endOfPathReached).toBe(true);
        expect(state.visibleNodeIds.size).toBe(0);
        expect(state.visibleNodes.length).toBe(0);
        expect(state.visibleRootNodes.length).toBe(0);
      });
    });

    describe("Simple Linear Flow", () => {
      it("should show all nodes in unconditional linear flow", () => {
        const nodes: Node<TreegeNodeData>[] = [
          {
            data: { name: "name", type: "text" } as InputNodeData,
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
          {
            data: { name: "email", type: "text" } as InputNodeData,
            id: "node-2",
            position: { x: 100, y: 0 },
            type: "input",
          },
        ];
        const edges: Edge<ConditionalEdgeData>[] = [{ id: "e1", source: "node-1", target: "node-2", type: "default" }];

        const state = getFlowRenderState(nodes, edges, {});

        expect(state.visibleNodeIds.has("node-1")).toBe(true);
        expect(state.visibleNodeIds.has("node-2")).toBe(true);
        expect(state.endOfPathReached).toBe(true);
        expect(state.visibleRootNodes.length).toBe(2);
      });

      it("should only show first node when waiting for input", () => {
        const nodes: Node<TreegeNodeData>[] = [
          {
            data: { name: "age", type: "number" } as InputNodeData,
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
          {
            data: { name: "next", type: "text" } as InputNodeData,
            id: "node-2",
            position: { x: 100, y: 0 },
            type: "input",
          },
        ];
        const edges: Edge<ConditionalEdgeData>[] = [
          {
            data: { conditions: [{ field: "node-1", operator: ">=", value: "18" }] },
            id: "e1",
            source: "node-1",
            target: "node-2",
            type: "conditional",
          },
        ];

        const state = getFlowRenderState(nodes, edges, {});

        expect(state.visibleNodeIds.has("node-1")).toBe(true);
        expect(state.visibleNodeIds.has("node-2")).toBe(false);
        expect(state.endOfPathReached).toBe(false);
      });
    });

    describe("Conditional Flow", () => {
      it("should follow matching conditional edge", () => {
        const nodes: Node<TreegeNodeData>[] = [
          {
            data: { name: "age", type: "number" } as InputNodeData,
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
          {
            data: { name: "adult", type: "text" } as InputNodeData,
            id: "node-2",
            position: { x: 100, y: 0 },
            type: "input",
          },
          {
            data: { name: "minor", type: "text" } as InputNodeData,
            id: "node-3",
            position: { x: 100, y: 100 },
            type: "input",
          },
        ];
        const edges: Edge<ConditionalEdgeData>[] = [
          {
            data: { conditions: [{ field: "node-1", operator: ">=", value: "18" }] },
            id: "e1",
            source: "node-1",
            target: "node-2",
            type: "conditional",
          },
          {
            data: { conditions: [{ field: "node-1", operator: "<", value: "18" }] },
            id: "e2",
            source: "node-1",
            target: "node-3",
            type: "conditional",
          },
        ];

        const state = getFlowRenderState(nodes, edges, { "node-1": "25" });

        expect(state.visibleNodeIds.has("node-1")).toBe(true);
        expect(state.visibleNodeIds.has("node-2")).toBe(true);
        expect(state.visibleNodeIds.has("node-3")).toBe(false);
      });

      it("should follow fallback edge when no conditions match", () => {
        const nodes: Node<TreegeNodeData>[] = [
          {
            data: { name: "choice", type: "radio" } as InputNodeData,
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
          {
            data: { name: "option-a", type: "text" } as InputNodeData,
            id: "node-2",
            position: { x: 100, y: 0 },
            type: "input",
          },
          {
            data: { name: "fallback", type: "text" } as InputNodeData,
            id: "node-3",
            position: { x: 100, y: 100 },
            type: "input",
          },
        ];
        const edges: Edge<ConditionalEdgeData>[] = [
          {
            data: { conditions: [{ field: "node-1", operator: "===", value: "a" }] },
            id: "e1",
            source: "node-1",
            target: "node-2",
            type: "conditional",
          },
          {
            data: { isFallback: true },
            id: "e2",
            source: "node-1",
            target: "node-3",
            type: "conditional",
          },
        ];

        const state = getFlowRenderState(nodes, edges, { "node-1": "b" });

        expect(state.visibleNodeIds.has("node-1")).toBe(true);
        expect(state.visibleNodeIds.has("node-2")).toBe(false);
        expect(state.visibleNodeIds.has("node-3")).toBe(true);
      });

      it("should handle AND conditions", () => {
        const nodes: Node<TreegeNodeData>[] = [
          {
            data: { name: "age", type: "number" } as InputNodeData,
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
          {
            data: { name: "license", type: "text" } as InputNodeData,
            id: "node-2",
            position: { x: 50, y: 0 },
            type: "input",
          },
          {
            data: { name: "eligible", type: "text" } as InputNodeData,
            id: "node-3",
            position: { x: 100, y: 0 },
            type: "input",
          },
        ];
        const edges: Edge<ConditionalEdgeData>[] = [
          { id: "e0", source: "node-1", target: "node-2", type: "default" },
          {
            data: {
              conditions: [
                { field: "node-1", logicalOperator: "AND", operator: ">=", value: "18" },
                { field: "node-2", operator: "===", value: "yes" },
              ],
            },
            id: "e1",
            source: "node-2",
            target: "node-3",
            type: "conditional",
          },
        ];

        const statePass = getFlowRenderState(nodes, edges, { "node-1": "25", "node-2": "yes" });
        expect(statePass.visibleNodeIds.has("node-3")).toBe(true);

        const stateFail = getFlowRenderState(nodes, edges, { "node-1": "15", "node-2": "yes" });
        expect(stateFail.visibleNodeIds.has("node-3")).toBe(false);
      });

      it("should handle OR conditions", () => {
        const nodes: Node<TreegeNodeData>[] = [
          {
            data: { name: "role", type: "text" } as InputNodeData,
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
          {
            data: { name: "admin-panel", type: "text" } as InputNodeData,
            id: "node-2",
            position: { x: 100, y: 0 },
            type: "input",
          },
        ];
        const edges: Edge<ConditionalEdgeData>[] = [
          {
            data: {
              conditions: [
                { field: "node-1", logicalOperator: "OR", operator: "===", value: "admin" },
                { field: "node-1", operator: "===", value: "moderator" },
              ],
            },
            id: "e1",
            source: "node-1",
            target: "node-2",
            type: "conditional",
          },
        ];

        const stateAdmin = getFlowRenderState(nodes, edges, { "node-1": "admin" });
        expect(stateAdmin.visibleNodeIds.has("node-2")).toBe(true);

        const stateMod = getFlowRenderState(nodes, edges, { "node-1": "moderator" });
        expect(stateMod.visibleNodeIds.has("node-2")).toBe(true);

        const stateUser = getFlowRenderState(nodes, edges, { "node-1": "user" });
        expect(stateUser.visibleNodeIds.has("node-2")).toBe(false);
      });
    });

    describe("Group Nodes", () => {
      it("should include parent groups in visible nodes", () => {
        const nodes: Node<TreegeNodeData>[] = [
          {
            data: { label: { en: "Group" } },
            id: "group-1",
            position: { x: 0, y: 0 },
            type: "group",
          },
          {
            data: { name: "input", type: "text" } as InputNodeData,
            id: "node-1",
            parentId: "group-1",
            position: { x: 10, y: 10 },
            type: "input",
          },
        ];
        const edges: Edge<ConditionalEdgeData>[] = [];

        const state = getFlowRenderState(nodes, edges, {});

        expect(state.visibleNodeIds.has("group-1")).toBe(true);
        expect(state.visibleNodeIds.has("node-1")).toBe(true);
        expect(state.visibleRootNodes.length).toBe(1);
        expect(state.visibleRootNodes[0].id).toBe("group-1");
      });

      it("should maintain correct order for grouped nodes", () => {
        const nodes: Node<TreegeNodeData>[] = [
          {
            data: { name: "first", type: "text" } as InputNodeData,
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
          {
            data: { label: { en: "Group" } },
            id: "group-1",
            position: { x: 100, y: 0 },
            type: "group",
          },
          {
            data: { name: "grouped", type: "text" } as InputNodeData,
            id: "node-2",
            parentId: "group-1",
            position: { x: 110, y: 10 },
            type: "input",
          },
        ];
        const edges: Edge<ConditionalEdgeData>[] = [{ id: "e1", source: "node-1", target: "node-2", type: "default" }];

        const state = getFlowRenderState(nodes, edges, {});

        expect(state.visibleNodes[0].id).toBe("node-1");
        expect(state.visibleNodes[1].id).toBe("group-1");
        expect(state.visibleNodes[2].id).toBe("node-2");
      });
    });

    describe("End of Path Detection", () => {
      it("should set endOfPathReached when no more nodes", () => {
        const nodes: Node<TreegeNodeData>[] = [
          {
            data: { name: "final", type: "text" } as InputNodeData,
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
        ];
        const edges: Edge<ConditionalEdgeData>[] = [];

        const state = getFlowRenderState(nodes, edges, {});

        expect(state.endOfPathReached).toBe(true);
      });

      it("should not set endOfPathReached when waiting for input", () => {
        const nodes: Node<TreegeNodeData>[] = [
          {
            data: { name: "choice", type: "text" } as InputNodeData,
            id: "node-1",
            position: { x: 0, y: 0 },
            type: "input",
          },
          {
            data: { name: "next", type: "text" } as InputNodeData,
            id: "node-2",
            position: { x: 100, y: 0 },
            type: "input",
          },
        ];
        const edges: Edge<ConditionalEdgeData>[] = [
          {
            data: { conditions: [{ field: "node-1", operator: "===", value: "yes" }] },
            id: "e1",
            source: "node-1",
            target: "node-2",
            type: "conditional",
          },
        ];

        const state = getFlowRenderState(nodes, edges, {});

        expect(state.endOfPathReached).toBe(false);
      });
    });
  });

  describe("mergeFlows", () => {
    describe("Basic Cases", () => {
      it("should return empty flow for null input", () => {
        const merged = mergeFlows(null);

        expect(merged.id).toBe("empty");
        expect(merged.nodes.length).toBe(0);
        expect(merged.edges.length).toBe(0);
      });

      it("should return empty flow for undefined input", () => {
        const merged = mergeFlows(undefined);

        expect(merged.id).toBe("empty");
        expect(merged.nodes.length).toBe(0);
        expect(merged.edges.length).toBe(0);
      });

      it("should return empty flow for empty array", () => {
        const merged = mergeFlows([]);

        expect(merged.id).toBe("empty");
        expect(merged.nodes.length).toBe(0);
        expect(merged.edges.length).toBe(0);
      });

      it("should return same flow for single flow", () => {
        const flow: Flow = {
          edges: [],
          id: "flow-1",
          nodes: [
            {
              data: { name: "input", type: "text" } as InputNodeData,
              id: "node-1",
              position: { x: 0, y: 0 },
              type: "input",
            },
          ],
        };

        const merged = mergeFlows(flow);

        expect(merged.id).toBe("flow-1");
        expect(merged.nodes.length).toBe(1);
      });
    });

    describe("FlowNode Replacement", () => {
      it("should replace FlowNode with target flow nodes", () => {
        const subFlow: Flow = {
          edges: [],
          id: "sub-flow",
          nodes: [
            {
              data: { name: "sub-input", type: "text" } as InputNodeData,
              id: "sub-1",
              position: { x: 0, y: 0 },
              type: "input",
            },
          ],
        };

        const mainFlow: Flow = {
          edges: [],
          id: "main-flow",
          nodes: [
            {
              data: { targetId: "sub-flow" } as FlowNodeData,
              id: "flow-node-1",
              position: { x: 0, y: 0 },
              type: "flow",
            },
          ],
        };

        const merged = mergeFlows([mainFlow, subFlow]);

        expect(merged.nodes.length).toBe(1);
        expect(merged.nodes[0].id).toBe("sub-1");
      });

      it("should redirect edges to FlowNode target", () => {
        const subFlow: Flow = {
          edges: [],
          id: "sub-flow",
          nodes: [
            {
              data: { name: "sub-input", type: "text" } as InputNodeData,
              id: "sub-1",
              position: { x: 0, y: 0 },
              type: "input",
            },
          ],
        };

        const mainFlow: Flow = {
          edges: [{ id: "e1", source: "start", target: "flow-node-1" }],
          id: "main-flow",
          nodes: [
            {
              data: { name: "start", type: "text" } as InputNodeData,
              id: "start",
              position: { x: 0, y: 0 },
              type: "input",
            },
            {
              data: { targetId: "sub-flow" } as FlowNodeData,
              id: "flow-node-1",
              position: { x: 100, y: 0 },
              type: "flow",
            },
          ],
        };

        const merged = mergeFlows([mainFlow, subFlow]);

        expect(merged.edges.length).toBe(1);
        expect(merged.edges[0].target).toBe("sub-1");
      });

      it("should connect terminal nodes of sub-flow to following nodes", () => {
        const subFlow: Flow = {
          edges: [],
          id: "sub-flow",
          nodes: [
            {
              data: { name: "sub-input", type: "text" } as InputNodeData,
              id: "sub-1",
              position: { x: 0, y: 0 },
              type: "input",
            },
          ],
        };

        const mainFlow: Flow = {
          edges: [{ id: "e1", source: "flow-node-1", target: "end" }],
          id: "main-flow",
          nodes: [
            {
              data: { targetId: "sub-flow" } as FlowNodeData,
              id: "flow-node-1",
              position: { x: 0, y: 0 },
              type: "flow",
            },
            {
              data: { name: "end", type: "text" } as InputNodeData,
              id: "end",
              position: { x: 200, y: 0 },
              type: "input",
            },
          ],
        };

        const merged = mergeFlows([mainFlow, subFlow]);

        expect(merged.nodes.some((n) => n.id === "sub-1")).toBe(true);
        expect(merged.nodes.some((n) => n.id === "end")).toBe(true);
        expect(merged.edges.some((e) => e.source === "sub-1" && e.target === "end")).toBe(true);
      });
    });

    describe("Main Flow Detection", () => {
      it("should detect main flow that references others", () => {
        const flowA: Flow = {
          edges: [],
          id: "flow-a",
          nodes: [
            {
              data: { name: "a", type: "text" } as InputNodeData,
              id: "a-1",
              position: { x: 0, y: 0 },
              type: "input",
            },
          ],
        };

        const mainFlow: Flow = {
          edges: [],
          id: "main",
          nodes: [
            {
              data: { targetId: "flow-a" } as FlowNodeData,
              id: "flow-node",
              position: { x: 0, y: 0 },
              type: "flow",
            },
          ],
        };

        const merged = mergeFlows([flowA, mainFlow]);

        expect(merged.id).toBe("main");
      });

      it("should work with flows in any order", () => {
        const subFlow: Flow = {
          edges: [],
          id: "sub",
          nodes: [
            {
              data: { name: "sub", type: "text" } as InputNodeData,
              id: "sub-1",
              position: { x: 0, y: 0 },
              type: "input",
            },
          ],
        };

        const mainFlow: Flow = {
          edges: [],
          id: "main",
          nodes: [
            {
              data: { targetId: "sub" } as FlowNodeData,
              id: "flow-node",
              position: { x: 0, y: 0 },
              type: "flow",
            },
          ],
        };

        // Try both orders
        const merged1 = mergeFlows([mainFlow, subFlow]);
        expect(merged1.id).toBe("main");

        const merged2 = mergeFlows([subFlow, mainFlow]);
        expect(merged2.id).toBe("main");
      });
    });

    describe("Edge Cases", () => {
      it("should handle FlowNode with missing target flow", () => {
        const mainFlow: Flow = {
          edges: [],
          id: "main",
          nodes: [
            {
              data: { targetId: "non-existent" } as FlowNodeData,
              id: "flow-node",
              position: { x: 0, y: 0 },
              type: "flow",
            },
            {
              data: { name: "field", type: "text" } as InputNodeData,
              id: "other-node",
              position: { x: 100, y: 0 },
              type: "input",
            },
          ],
        };

        const merged = mergeFlows(mainFlow);

        // Both nodes remain (FlowNode stays when target not found)
        expect(merged.nodes.length).toBe(2);
        expect(merged.nodes.some((n) => n.id === "other-node")).toBe(true);
      });

      it("should handle FlowNode without targetId", () => {
        const mainFlow: Flow = {
          edges: [],
          id: "main",
          nodes: [
            {
              data: {} as FlowNodeData,
              id: "flow-node",
              position: { x: 0, y: 0 },
              type: "flow",
            },
            {
              data: { name: "field", type: "text" } as InputNodeData,
              id: "other-node",
              position: { x: 100, y: 0 },
              type: "input",
            },
          ],
        };

        const merged = mergeFlows(mainFlow);

        // Both nodes remain (FlowNode stays when no targetId)
        expect(merged.nodes.length).toBe(2);
        expect(merged.nodes.some((n) => n.id === "other-node")).toBe(true);
      });

      it("should include sub-flow nodes only once when referenced multiple times", () => {
        const subFlow: Flow = {
          edges: [],
          id: "sub",
          nodes: [
            {
              data: { name: "sub", type: "text" } as InputNodeData,
              id: "sub-1",
              position: { x: 0, y: 0 },
              type: "input",
            },
          ],
        };

        const mainFlow: Flow = {
          edges: [],
          id: "main",
          nodes: [
            {
              data: { targetId: "sub" } as FlowNodeData,
              id: "flow-a",
              position: { x: 0, y: 0 },
              type: "flow",
            },
            {
              data: { targetId: "sub" } as FlowNodeData,
              id: "flow-b",
              position: { x: 100, y: 0 },
              type: "flow",
            },
          ],
        };

        const merged = mergeFlows([mainFlow, subFlow]);

        const subNodes = merged.nodes.filter((n) => n.id === "sub-1");
        expect(subNodes.length).toBe(1);
      });
    });
  });
});
