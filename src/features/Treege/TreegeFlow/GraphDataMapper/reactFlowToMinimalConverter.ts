import { Edge, Node } from "@xyflow/react";
import { MinimalEdge, MinimalGraph, MinimalNode } from "@/features/Treege/TreegeFlow/GraphDataMapper/DataTypes";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

/** Convert Node ReactFlow → MinimalNode (without child option node) */
const toMinimalNodes = (rfNodes: Node<CustomNodeData>[]): MinimalNode[] =>
  rfNodes
    .filter((n) => !n.id.includes("-attr-"))
    .map((n) => ({
      data: {
        attributes: n.data.attributes ?? [],
        isDecision: n.data.isDecision,
        name: n.data.name,
        type: n.data.type,
      },
      id: n.id,
    }));

/** Convert Edge ReactFlow → MinimalEdge */
const toMinimalEdges = (rfEdges: Edge[]): MinimalEdge[] =>
  rfEdges
    .filter((e) => !e.id.includes("-attr-")) // ignore edges attributs
    .map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
    }));

/** React Flow → MinimalGraph */
const reactFlowToMinimal = (rfNodes: Node<CustomNodeData>[], rfEdges: Edge[]): MinimalGraph => ({
  edges: toMinimalEdges(rfEdges),
  nodes: toMinimalNodes(rfNodes),
});

export default reactFlowToMinimal;
