import { Node, Edge } from "@xyflow/react";
import { useEffect, useState } from "react";
import computeGraphLayout from "@/features/Treege/TreegeFlow/Layout/computeGraphLayout";
import { toReactFlowEdges, toReactFlowNodes } from "@/features/Treege/TreegeFlow/utils/toReactFlowConverter";
import { Attributes, CustomNodeData, MinimalEdge, MinimalGraph, MinimalNode } from "@/features/Treege/TreegeFlow/utils/types";
import { getUUID } from "@/utils";

/**
 * Expand a MinimalGraph:
 * - Turns each node’s `children` into real option nodes and edges with UUIDs.
 */
const expandMinimalGraphWithChildren = (graph: MinimalGraph): MinimalGraph => {
  const extraNodes: MinimalNode[] = [];
  const extraEdges: MinimalEdge[] = [];

  const existingNodeUuids = new Set(graph.nodes.map((n) => n.uuid));
  const existingEdgeUuids = new Set(graph.edges.map((e) => e.uuid));

  const addNodeIfNotExists = (node: MinimalNode) => {
    if (!existingNodeUuids.has(node.uuid)) {
      extraNodes.push(node);
      existingNodeUuids.add(node.uuid);
    }
  };

  const addEdgeIfNotExists = (edge: MinimalEdge) => {
    if (!existingEdgeUuids.has(edge.uuid)) {
      extraEdges.push(edge);
      existingEdgeUuids.add(edge.uuid);
    }
  };

  const walkChildren = (parent: MinimalNode, children: (MinimalNode | Attributes)[]) => {
    children.forEach((child) => {
      if ("attributes" in child && "uuid" in child) {
        // child est un MinimalNode
        const edgeUuid = getUUID();
        addEdgeIfNotExists({
          source: parent.uuid,
          target: child.uuid,
          type: child.attributes.type ?? "option",
          uuid: edgeUuid,
        });
        addNodeIfNotExists(child);
        if (child.children?.length) {
          walkChildren(child, child.children);
        }
      } else {
        // child est Attributes
        const childAttr = child as Attributes;
        const childUuid = getUUID();
        const edgeUuid = getUUID();

        const newChildNode: MinimalNode = {
          attributes: {
            ...childAttr,
            type: childAttr.type ?? "option",
          },
          children: [],
          uuid: childUuid,
        };

        addNodeIfNotExists(newChildNode);
        addEdgeIfNotExists({
          source: parent.uuid,
          target: childUuid,
          type: "option",
          uuid: edgeUuid,
        });
      }
    });
  };

  graph.nodes.forEach((node) => {
    if (node.children?.length) {
      walkChildren(node, node.children);
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
    let reactFlowEdges = toReactFlowEdges(expandedGraph.edges);

    reactFlowEdges = reactFlowEdges.map((e) => ({
      ...e,
      sourceHandle: `${e.source}-out`,
      targetHandle: `${e.target}-in`,
    }));

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
