import dagre from "@dagrejs/dagre";
import { addEdge, ConnectionLineType, Edge, Node, Position, useEdgesState, useNodesState } from "@xyflow/react";
import { Connection } from "@xyflow/system/dist/esm/types/general";
import { useCallback, useEffect, useMemo } from "react";
import { TreeNode } from "@/features/Treege/type/TreeNode";
import useTreeTransformer from "@/hooks/useTreeTransformer";

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
    };
  });

  return {
    edges,
    nodes: positionedNodes,
  };
};

const useTreeViewer = (treeData: TreeNode | null) => {
  // Transform data
  const transformedData = useTreeTransformer(treeData);

  // Memoize the layout calculation
  const graphLayout = useMemo(
    () => calculateGraphLayout(transformedData.nodes as Node[], transformedData.edges),
    [transformedData.nodes, transformedData.edges],
  );

  // Setup states with memoized layout
  const [nodes, setNodes, onNodesChange] = useNodesState(graphLayout.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphLayout.edges);

  // Update only when layout changes
  useEffect(() => {
    if (JSON.stringify(nodes) !== JSON.stringify(graphLayout.nodes)) {
      setNodes(graphLayout.nodes);
      setEdges(graphLayout.edges);
    }
  }, [graphLayout, setNodes, setEdges, nodes]);

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
