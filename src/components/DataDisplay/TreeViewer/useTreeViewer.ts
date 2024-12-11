import dagre from "@dagrejs/dagre";
import { addEdge, ConnectionLineType, Edge, Node, Position, useEdgesState, useNodesState } from "@xyflow/react";
import { Connection } from "@xyflow/system/dist/esm/types/general";
import { useCallback, useEffect } from "react";
import { TreeNode } from "@/features/Treege/type/TreeNode";
import transformTreeToFlow from "@/utils/tree/transformTreeToFlow/transformTreeToFlow";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const nodeWidth = 172;
const nodeHeight = 36;

const calculateGraphLayout = (nodes: Node[], edges: Edge[], direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { height: nodeHeight, width: nodeWidth });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const positionedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
    } as Node;
  });

  return { edges, nodes: positionedNodes };
};

const useTreeViewer = (treeData?: TreeNode | null) => {
  const { nodes: initialNodes, edges: initialEdges } = transformTreeToFlow(treeData);
  const { nodes: layoutedNodes, edges: layoutedEdges } = calculateGraphLayout(initialNodes as Node[], initialEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  useEffect(() => {
    if (treeData) {
      const { nodes: newNodes, edges: newEdges } = transformTreeToFlow(treeData);
      const { nodes: layoutedNewNodes, edges: layoutedNewEdges } = calculateGraphLayout(newNodes as Node[], newEdges);
      setNodes(layoutedNewNodes);
      setEdges(layoutedNewEdges);
    }
  }, [setEdges, setNodes, treeData]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            type: ConnectionLineType.SmoothStep,
          },
          eds,
        ),
      ),
    [setEdges],
  );

  return {
    edges,
    nodes,
    onConnect,
    onEdgesChange,
    onNodesChange,
  };
};

export default useTreeViewer;
