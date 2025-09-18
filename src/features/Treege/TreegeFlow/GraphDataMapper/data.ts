import { MinimalGraph } from "@/features/Treege/TreegeFlow/GraphDataMapper/DataTypes";

const minimalGraph: MinimalGraph = {
  edges: [{ id: "edge-1", source: "root-1", target: "node-1" }],
  nodes: [
    { data: { name: "Node 1", type: "text" }, id: "root-1" },
    {
      data: {
        attributes: [
          { key: "true", value: "true" },
          { key: "false", value: "false" },
        ],
        isDecision: true,
        name: "a",
        type: "boolean",
      },
      id: "node-1",
    },
  ],
};

export default minimalGraph;
