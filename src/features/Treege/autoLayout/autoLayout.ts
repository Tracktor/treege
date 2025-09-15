import ELK from "elkjs/lib/elk.bundled.js";
import type { Node, Edge } from "reactflow";

const elk = new ELK();

const autoLayout = async (nodes: Node[], edges: Edge[]) => {
  const graph = {
    children: nodes.map((n) => ({
      height: 50,
      id: n.id,
      width: 150,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      sources: [e.source],
      targets: [e.target],
    })),
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "DOWN",
      "elk.spacing.nodeNode": "50",
    },
  };

  const layout = await elk.layout(graph);

  return nodes.map((node) => {
    const layoutNode = layout.children?.find((n) => n.id === node.id);
    return {
      ...node,
      position: {
        x: layoutNode?.x ?? node.position.x,
        y: layoutNode?.y ?? node.position.y,
      },
    };
  });
};

export default autoLayout;
