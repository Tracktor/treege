import { Node, Edge } from "@xyflow/react";
import { CustomNodeData, MinimalEdge, MinimalGraph, MinimalNode, NodeOptions } from "@/features/Treege/TreegeFlow/utils/types";

/** Convert ReactFlow nodes → MinimalNode[] */
const toMinimalNodes = (rfNodes: Node<CustomNodeData>[]): MinimalNode[] =>
  rfNodes
    .filter((n) => !n.id.includes("-option-"))
    .map((n) => {
      const attributes: NodeOptions = {
        isDecision: n.data.isDecision ?? false,
        label: n.data.label ?? "",
        name: n.data.name ?? "",
        sourceHandle: n.data.sourceHandle,
        type: n.data.type ?? "text",
        value: n.data.value ?? "",
      };

      const options: NodeOptions[] = Array.isArray(n.data.options)
        ? n.data.options.map((opt) => ({
            isDecision: opt.isDecision ?? false,
            label: opt.label ?? "",
            name: opt.name ?? "",
            sourceHandle: opt.sourceHandle,
            type: opt.type ?? "option",
            value: opt.value ?? "",
          }))
        : [];

      return {
        attributes,
        id: n.id,
        options,
      };
    });

/** Convert ReactFlow edges → MinimalEdge[] */
const toMinimalEdges = (rfEdges: Edge[]): MinimalEdge[] =>
  rfEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: e.type ?? (e.id.includes("-option-") ? "option" : "default"),
  }));

/** React Flow → MinimalGraph */
const reactFlowToMinimal = (rfNodes: Node<CustomNodeData>[], rfEdges: Edge[]): MinimalGraph => ({
  edges: toMinimalEdges(rfEdges),
  nodes: toMinimalNodes(rfNodes),
});

export default reactFlowToMinimal;
