import { MinimalGraph } from "@/features/Treege/TreegeFlow/utils/types";

const minimalGraph: MinimalGraph = {
  edges: [
    {
      id: "edge-test-1",
      source: "node-test-1",
      target: "node-test-2",
      type: "default",
    },
  ],
  nodes: [
    {
      attributes: {
        isDecision: false,
        label: "Node test 1 label",
        name: "Node test 1",
        type: "text",
        value: "node-test-1-value",
      },
      children: [],
      id: "node-test-1",
    },
    {
      attributes: {
        isDecision: true,
        label: "Node test 2 label",
        name: "Node test 2",
        type: "boolean",
        value: "node-test-2-value",
      },
      children: [
        {
          isDecision: false,
          label: "True option",
          name: "true",
          type: "option",
          value: "true",
        },
        {
          isDecision: false,
          label: "False option",
          name: "false",
          type: "option",
          value: "false",
        },
      ],
      id: "node-test-2",
    },
  ],
};

export default minimalGraph;
