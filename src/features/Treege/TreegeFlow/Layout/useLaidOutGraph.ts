import { Node, Edge } from "@xyflow/react";
import { useEffect, useState } from "react";
import computeGraphLayout from "@/features/Treege/TreegeFlow/Layout/computeGraphLayout";
import { toReactFlowEdges, toReactFlowNodes } from "@/features/Treege/TreegeFlow/utils/toReactFlowConverter";
import { Attributes, CustomNodeData, MinimalEdge, MinimalGraph, MinimalNode } from "@/features/Treege/TreegeFlow/utils/types";

/**
 * Expand a MinimalGraph:
 * - Turns each node’s `children` into real option nodes and edges.
 */
const expandMinimalGraphWithChildren = (graph: MinimalGraph): MinimalGraph => {
  const extraNodes: MinimalNode[] = [];
  const extraEdges: MinimalEdge[] = [];

  const walkChildren = (parent: MinimalNode, children: (MinimalNode | Attributes)[], level = 0) => {
    children.forEach((child, index) => {
      if ("attributes" in child && "id" in child) {
        extraEdges.push({
          id: `edge-${parent.id}-${child.id}`,
          source: parent.id,
          target: child.id,
          type: child.attributes.type ?? "option",
        });
        if (!graph.nodes.find((n) => n.id === child.id) && !extraNodes.find((n) => n.id === child.id)) {
          extraNodes.push(child);
        }
        if (child.children?.length) {
          walkChildren(child, child.children, level + 1);
        }
      } else {
        const childAttr = child as Attributes;
        const childId = `${parent.id}-child-${level}-${index}`;
        if (!graph.nodes.find((n) => n.id === childId) && !extraNodes.find((n) => n.id === childId)) {
          extraNodes.push({
            attributes: {
              ...childAttr,
              type: childAttr.type ?? "option",
            },
            children: [],
            id: childId,
          });
        }
        extraEdges.push({
          id: `edge-${parent.id}-child-${level}-${index}`,
          source: parent.id,
          target: childId,
          type: "option",
        });
      }
    });
  };

  graph.nodes.forEach((node) => {
    if (node.children?.length) {
      walkChildren(node, node.children, 0);
    }
  });

  return {
    edges: [...graph.edges, ...extraEdges],
    nodes: [...graph.nodes, ...extraNodes],
  };
};

/**
 * Hook converting a MinimalGraph to React Flow nodes & edges,
 * automatically expanding "children" into child nodes/edges,
 * and computing the layout via ELK.
 */
const useLaidOutGraph = (graph: MinimalGraph) => {
  const [laidOutNodes, setLaidOutNodes] = useState<Node<CustomNodeData>[]>([]);
  const [laidOutEdges, setLaidOutEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (!graph?.nodes?.length) {
      setLaidOutNodes([]);
      setLaidOutEdges([]);
      return;
    }

    // 1️⃣ Expand children → create child option nodes & edges
    const expandedGraph = expandMinimalGraphWithChildren(graph);

    // 2️⃣ Convert MinimalGraph → React Flow nodes & edges
    const reactFlowNodes = toReactFlowNodes(expandedGraph.nodes);
    const reactFlowEdges = toReactFlowEdges(expandedGraph.edges);

    // 3️⃣ Compute layout with ELK
    (async () => {
      try {
        const { nodes, edges } = await computeGraphLayout(reactFlowNodes, reactFlowEdges);
        setLaidOutNodes(nodes);
        setLaidOutEdges(edges);
      } catch (err) {
        console.error("ELK layout error:", err);

        setLaidOutNodes(reactFlowNodes);
        setLaidOutEdges(reactFlowEdges);
      }
    })();
  }, [graph]);

  return { edges: laidOutEdges, nodes: laidOutNodes };
};

export default useLaidOutGraph;
