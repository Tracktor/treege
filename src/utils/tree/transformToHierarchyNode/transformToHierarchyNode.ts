import { Edge, NodeProps } from "@xyflow/react";
import type { AppNode } from "@/components/DataDisplay/Nodes";
import type { TreeNode } from "@/features/Treege/type/TreeNode";

export interface HierarchyPointNode<T> {
  data: T;
  depth: number;
  x: number;
  y: number;
  children?: HierarchyPointNode<T>[];
}

const convertToNodeProps = (node: AppNode): NodeProps<AppNode> => ({
  data: node.data,
  deletable: true,
  draggable: true,
  dragging: false,
  id: node.id,
  isConnectable: true,
  positionAbsoluteX: node.position?.x || 0,
  positionAbsoluteY: node.position?.y || 0,
  selectable: true,
  selected: false,
  type: node.type || "default",
  zIndex: 0,
});

/**
 * Transforms a React Flow node into a HierarchyPointNode
 */
const transformToHierarchyNode = (nodeProps: NodeProps<AppNode>, allNodes: AppNode[], edges: Edge[]): HierarchyPointNode<TreeNode> => {
  const childEdges = edges.filter((edge) => edge.source === nodeProps.id);
  const childNodes = allNodes.filter((node) => childEdges.some((edge) => edge.target === node.id)).map(convertToNodeProps);
  const transformedChildren = childNodes.map((childNode) => transformToHierarchyNode(childNode, allNodes, edges));

  return {
    children: transformedChildren,
    data: {
      attributes: nodeProps.data,
      children: transformedChildren.map((child) => ({
        attributes: child.data.attributes,
        children: [],
        uuid: child.data.uuid,
      })),
      uuid: nodeProps.id,
    },
    depth: nodeProps.data.depth,
    x: nodeProps.positionAbsoluteX,
    y: nodeProps.positionAbsoluteY,
  };
};

export default transformToHierarchyNode;
