import type { TreeNode } from "@tracktor/types-treege";
import { Node, Edge } from "@xyflow/react";
import { TreeEdge, TreeGraph, TreeNodeData } from "@/features/TreegeFlow/utils/types";

/** Convert ReactFlow nodes → TreeNodes[] */
const toTreeNodes = (reactFlowNodes: Node<TreeNodeData>[]): TreeNodeData[] =>
  reactFlowNodes
    .filter((n) => !n.id.includes("-option-") && (n.data.attributes?.type ?? "option") !== "option")
    .map((n) => {
      const attr = n.data.attributes;

      const attributes: TreeNode["attributes"] =
        attr && "type" in attr
          ? {
              depth: 0,
              isDecision: attr.isDecision ?? false,
              label: attr.label ?? "",
              name: attr.name ?? "",
              type: attr.type ?? "text",
              values:
                attr.values && attr.values.length > 0
                  ? [
                      {
                        id: attr.name ?? "",
                        label: attr.label ?? "",
                        value: attr.values[0].value,
                      },
                    ]
                  : undefined,
            }
          : {
              depth: 0,
              label: attr?.label ?? "",
              message: String(attr?.message ?? ""),
              name: attr?.name ?? "",
              value: attr?.value ?? "",
            };

      const children: TreeNode[] = Array.isArray(n.data.children)
        ? n.data.children.map((child) => ({
            attributes: {
              depth: 1,
              label: child.attributes?.label ?? "",
              message: child.attributes?.message ?? "",
              name: child.attributes?.name ?? `${attr.name}:`,
              value: child.attributes?.value ?? "",
            },
            children: [],
            uuid: child.uuid ?? `${n.id}-child-${child.attributes?.value ?? ""}`,
          }))
        : [];

      return {
        attributes,
        children,
        uuid: n.id,
      };
    });

/** Convert ReactFlow edges → TreeEdge[] */
const toTreeEdges = (reactFlowEdges: Edge[]): TreeEdge[] =>
  reactFlowEdges.map((e) => ({
    source: e.source,
    target: e.target,
    // ⬇️ fallback sur "option" si l’id contient -option-
    type: e.type ?? (e.id.includes("-option-") ? "option" : "default"),
    uuid: e.id,
  }));

/** React Flow → MinimalGraph (imbriqué + edges complets) */
const reactFlowToTreeGraph = (reactFlowNodes: Node<TreeNodeData>[], reactFlowEdges: Edge[]): TreeGraph => {
  if (!reactFlowNodes?.length && !reactFlowEdges?.length) {
    return {};
  }

  return {
    edges: toTreeEdges(reactFlowEdges),
    nodes: toTreeNodes(reactFlowNodes),
  };
};

export default reactFlowToTreeGraph;
