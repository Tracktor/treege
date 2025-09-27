import { Connection, Edge, EdgeChange, Node, NodeChange } from "@xyflow/react";
import { createContext } from "react";
import { TreeGraph, TreeNode, TreeNodeData } from "@/features/TreegeFlow/utils/types";

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
}

export const TreegeFlowContext = createContext<TreegeFlowContextValue>({
  addChild: () => {},
  addNode: () => {},
  deleteEdge: () => {},
  deleteNode: () => {},
  edges: [],
  graph: { edges: [], nodes: [] },
  layoutEngineName: "elk",
  nodes: [],
  onConnect: () => {},
  onEdgesChange: () => {},
  onNodesChange: () => {},
  setGraph: () => {},
  setLayoutEngineName: () => {},
  updateNode: () => {},
});
