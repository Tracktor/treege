import dagre from "@dagrejs/dagre";
import { addEdge, ConnectionLineType, Edge, Node, Position, useEdgesState, useNodesState } from "@xyflow/react";
import { Connection } from "@xyflow/system/dist/esm/types/general";
import { useCallback, useEffect } from "react";
import { NODE_HEIGHT, NODE_WIDTH } from "@/constants/node";
import { TreeNode } from "@/features/Treege/type/TreeNode";
import transformTreeToFlow from "@/utils/tree/transformTreeToFlow/transformTreeToFlow";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const calculateGraphLayout = (nodes: Node[], edges: Edge[], direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      height: NODE_HEIGHT,
      width: NODE_WIDTH,
    });
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
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
    } as Node;
  });

  return { edges, nodes: positionedNodes };
};

const useTreeViewer = (treeData?: TreeNode | null) => {
  const { nodes: initialNodes, edges: initialEdges } = transformTreeToFlow(treeData);
  const { nodes: calculatedNodes, edges: calculateEdges } = calculateGraphLayout(initialNodes as Node[], initialEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState(calculatedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(calculateEdges);

  useEffect(() => {
    if (treeData) {
      const { nodes: newNodes, edges: newEdges } = transformTreeToFlow(treeData);
      const { nodes: calculatedNewNodes, edges: calculateNewEdges } = calculateGraphLayout(newNodes as Node[], newEdges);
      setNodes(calculatedNewNodes);
      setEdges(calculateNewEdges);
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
