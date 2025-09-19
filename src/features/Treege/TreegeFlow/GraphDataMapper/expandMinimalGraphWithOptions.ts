import { MinimalEdge, MinimalGraph, MinimalNode, NodeOptions } from "@/features/Treege/TreegeFlow/utils/types";

const expandMinimalGraphWithOptions = (graph: MinimalGraph): MinimalGraph => {
  const extraNodes: MinimalNode[] = [];
  const extraEdges: MinimalEdge[] = [];

  graph.nodes.forEach((node) => {
    node.options?.forEach((opt: NodeOptions, index: number) => {
      const childId = `${node.id}-option-${index}`;

      if (!graph.nodes.find((n) => n.id === childId) && !extraNodes.find((n) => n.id === childId)) {
        extraNodes.push({
          attributes: {
            ...opt,
            type: opt.type ?? "option",
          },
          id: childId,
          options: [],
        });

        extraEdges.push({
          id: `edge-${node.id}-option-${index}`,
          source: node.id,
          target: childId,
          type: "option",
        });
      }
    });
  });

  return {
    edges: [...graph.edges, ...extraEdges],
    nodes: [...graph.nodes, ...extraNodes],
  };
};

export default expandMinimalGraphWithOptions;
