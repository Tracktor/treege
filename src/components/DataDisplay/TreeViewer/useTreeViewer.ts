import dagre from "@dagrejs/dagre";
import { addEdge, ConnectionLineType, Edge, Position, useEdgesState, useNodesState } from "@xyflow/react";
import { Connection } from "@xyflow/system/dist/esm/types/general";
import { useCallback } from "react";
import { AppNode } from "@/components/DataDisplay/Nodes";
import { initialEdges, initialNodes } from "~/mock";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const nodeWidth = 172;
const nodeHeight = 36;

const getElements = (nodes: AppNode[], edges: Edge[], direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { height: nodeHeight, width: nodeWidth });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
    };
  });

  return { edges, nodes: newNodes };
};

const { nodes: defaultNode, edges: defaultEdge } = getElements(initialNodes, initialEdges);

const useTreeViewer = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(defaultNode);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(defaultEdge);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, type: ConnectionLineType.SmoothStep }, eds)),
    [setEdges],
  );

  return {
    edges,
    nodes,
    onConnect,
    onEdgesChange,
    onNodesChange,
    setNodes,
  };
};

export default useTreeViewer;
