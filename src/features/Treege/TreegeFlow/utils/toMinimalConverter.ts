// reactFlowToMinimal.ts
import { Node, Edge } from "@xyflow/react";
import { Attributes, CustomNodeData, MinimalEdge, MinimalGraph, MinimalNode } from "@/features/Treege/TreegeFlow/utils/types";

/** Convert ReactFlow nodes → MinimalNode[] */
const toMinimalNodes = (rfNodes: Node<CustomNodeData>[]): MinimalNode[] =>
  rfNodes
    .filter((n) => !n.id.includes("-option-")) // On ne prend que les vrais nodes
    .map((n) => {
      const attributes: Attributes = {
        isDecision: n.data.isDecision ?? false,
        label: n.data.label ?? "",
        name: n.data.name ?? "",
        sourceHandle: n.data.sourceHandle,
        type: n.data.type ?? "text",
        value: n.data.value ?? "",
      };

      const children: Attributes[] = Array.isArray(n.data.children)
        ? n.data.children.map((child) => ({
            isDecision: child.isDecision ?? false,
            label: child.label ?? "",
            name: child.name ?? "",
            sourceHandle: child.sourceHandle,
            type: child.type ?? "option",
            value: child.value ?? "",
          }))
        : [];

      return {
        attributes,
        children,
        id: n.id,
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
