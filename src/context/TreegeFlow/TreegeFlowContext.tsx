import type { TreeNode } from "@tracktor/types-treege";
import { Connection, Edge, EdgeChange, Node, NodeChange } from "@xyflow/react";
import { createContext } from "react";
import { TreeGraph, TreeNodeData } from "@/features/TreegeFlow/utils/types";

export interface TreegeFlowContextValue {
  nodes: Node<TreeNodeData>[];
  edges: Edge[];
  graph: TreeGraph;
  setGraph: (g: TreeGraph) => void;
  onNodesChange: (changes: NodeChange<Node<TreeNodeData>>[]) => void;
  onEdgesChange: (changes: EdgeChange<Edge>[]) => void;
  onConnect: (connection: Connection) => void;
  updateNode: (nodeId: string, attributes: TreeNode["attributes"], children?: TreeNode[]) => void;
  addChild: (nodeId: string, child: TreeNode) => void;
  addNode: (
    parentId?: string,
    attrs?: Partial<TreeNode["attributes"]> & {
      childId?: string;
      children?: TreeNode[];
    },
  ) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  layoutEngineName: "dagre" | "elk";
  setLayoutEngineName: (name: "dagre" | "elk") => void;
  orientation: "vertical" | "horizontal";
  setOrientation: (orientation: "vertical" | "horizontal") => void;
}

export const TreegeFlowContext = createContext<TreegeFlowContextValue>({
  addChild: () => {},
  addNode: () => {},
  deleteEdge: () => {},
  deleteNode: () => {},
  edges: [],
  graph: {},
  layoutEngineName: "elk",
  nodes: [],
  onConnect: () => {},
  onEdgesChange: () => {},
  onNodesChange: () => {},
  orientation: "vertical",
  setGraph: () => {},
  setLayoutEngineName: () => {},
  setOrientation: () => {},
  updateNode: () => {},
});
