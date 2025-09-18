import { MinimalGraph } from "@/features/Treege/TreegeFlow/GraphDataMapper/DataTypes";

const minimalGraph: MinimalGraph = {
  edges: [{ id: "edge-test-1", source: "node-test-1", target: "node-test-2" }],
  nodes: [
    { data: { name: "Node test 1", type: "text" }, id: "node-test-1" },
    {
      data: {
        attributes: [
          { key: "true", value: "true" },
          { key: "false", value: "false" },
        ],
        isDecision: true,
        name: "Node test 2",
        type: "boolean",
      },
      id: "node-test-2",
    },
  ],
};

export default minimalGraph;
