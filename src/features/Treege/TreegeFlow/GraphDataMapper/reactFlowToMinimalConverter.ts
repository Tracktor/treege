import { Edge, Node } from "@xyflow/react";
import { MinimalEdge, MinimalGraph, MinimalNode } from "@/features/Treege/TreegeFlow/GraphDataMapper/DataTypes";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

/** Convert Node ReactFlow → MinimalNode */
const toMinimalNodes = (rfNodes: Node<CustomNodeData>[]): MinimalNode[] =>
  rfNodes.map((n) => ({
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
  rfEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: e.type,
  }));

/** React Flow → MinimalGraph */
const reactFlowToMinimal = (rfNodes: Node<CustomNodeData>[], rfEdges: Edge[]): MinimalGraph => ({
  edges: toMinimalEdges(rfEdges),
  nodes: toMinimalNodes(rfNodes),
});

export default reactFlowToMinimal;
