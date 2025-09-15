import type { Node, Edge } from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";

const elk = new ELK();

const autoLayout = async (nodes: Node[], edges: Edge[]) => {
  // Si on n'a qu'un seul node, pas besoin de layout
  if (nodes.length <= 1) {
    return nodes;
  }

  console.log(
    "AutoLayout input - Nodes:",
    nodes.map((n) => n.id),
  );
  console.log(
    "AutoLayout input - Edges:",
    edges.map((e) => `${e.source} -> ${e.target}`),
  );

  const graph = {
    children: nodes.map((n) => ({
      // Correspond à la largeur de votre Card
      height: 150,

      id: n.id,
      width: 200, // Correspond à la hauteur de votre Card
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
      "elk.layered.spacing.nodeNodeBetweenLayers": "100",
      "elk.spacing.edgeNode": "40",
      "elk.spacing.nodeNode": "80",
    },
  };

  console.log("ELK Graph:", JSON.stringify(graph, null, 2));

  try {
    const layout = await elk.layout(graph);
    console.log("ELK Layout result:", layout);

    const layoutedNodes = nodes.map((node) => {
      const layoutNode = layout.children?.find((n) => n.id === node.id);

      if (!layoutNode) {
        console.warn(`Layout node not found for ${node.id}, keeping original position`);
        return node;
      }

      return {
        ...node,
        position: {
          x: layoutNode.x ?? node.position.x,
          y: layoutNode.y ?? node.position.y,
        },
      };
    });

    console.log(
      "Final layouted nodes:",
      layoutedNodes.map((n) => `${n.id}: (${n.position.x}, ${n.position.y})`),
    );
    return layoutedNodes;
  } catch (error) {
    console.error("ELK Layout error:", error);
    throw error;
  }
};

export default autoLayout;
