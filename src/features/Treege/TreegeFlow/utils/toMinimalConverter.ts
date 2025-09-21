import { Node, Edge } from "@xyflow/react";
import { Attributes, CustomNodeData, MinimalEdge, MinimalGraph, MinimalNode } from "@/features/Treege/TreegeFlow/utils/types";

/** Convert ReactFlow nodes → MinimalNode[] */
const toMinimalNodes = (rfNodes: Node<CustomNodeData>[]): MinimalNode[] =>
  rfNodes
    .filter((n) => !n.id.includes("-option-"))
    .map((n) => {
      const attributes: Attributes = {
        isDecision: n.data.isDecision ?? false,
        label: n.data.label ?? "",
        message: n.data.message ?? "",
        name: n.data.name ?? "",
        sourceHandle: n.data.sourceHandle,
        type: n.data.type ?? "text",
        value: n.data.value ?? "",
      };

      const children: MinimalNode[] = Array.isArray(n.data.children)
        ? n.data.children.map((child) => ({
            attributes: {
              isDecision: child.attributes?.isDecision ?? false,
              label: child.attributes?.label ?? "",
              message: child.attributes?.message ?? "",
              name: child.attributes?.name ?? "",
              sourceHandle: child.attributes?.sourceHandle,
              type: child.attributes?.type ?? "option",
              value: child.attributes?.value ?? "",
            },
            children: child.children ?? [],
            id: child.id ?? `${n.id}-child-${child.attributes?.value ?? ""}`,
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
