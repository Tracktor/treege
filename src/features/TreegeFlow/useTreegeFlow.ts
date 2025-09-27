import { useReactFlow } from "@xyflow/react";
import { MouseEvent, useEffect, useRef, useState } from "react";
import EdgeFactory from "@/features/TreegeFlow/Edges/EdgeFactory";
import NodeFactory from "@/features/TreegeFlow/Nodes/NodeFactory";
import reactFlowToMinimal from "@/features/TreegeFlow/utils/toMinimalConverter";
import useTreegeFlowContext from "@/hooks/useTreegeFlowContext";

export const treeFlow = {
  edges: {
    default: EdgeFactory,
    option: EdgeFactory,
  },
  nodes: {
    address: NodeFactory,
    autocomplete: NodeFactory,
    boolean: NodeFactory,
    checkbox: NodeFactory,
    date: NodeFactory,
    dateRange: NodeFactory,
    default: NodeFactory,
    dynamicSelect: NodeFactory,
    email: NodeFactory,
    file: NodeFactory,
    hidden: NodeFactory,
    number: NodeFactory,
    option: NodeFactory,
    password: NodeFactory,
    radio: NodeFactory,
    select: NodeFactory,
    switch: NodeFactory,
    tel: NodeFactory,
    text: NodeFactory,
    time: NodeFactory,
    timeRange: NodeFactory,
    title: NodeFactory,
    url: NodeFactory,
  },
};

const useTreegeFlow = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, graph, onConnect, setGraph, layoutEngineName, setLayoutEngineName } =
    useTreegeFlowContext();

  const minimalGraph = reactFlowToMinimal(nodes, edges);
  const isGraphEmpty = !graph?.nodes || graph.nodes.length === 0;

  const { fitView } = useReactFlow();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const prevNodeIdsRef = useRef<string[]>([]);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewerChange = (value: string) => {
    const parsed = JSON.parse(value);

    prevNodeIdsRef.current = [];
    setGraph(parsed);
  };

  useEffect(() => {
    const currentIds = nodes.map((n) => n.id).sort();
    const prevIds = prevNodeIdsRef.current.sort();

    const changed = currentIds.length !== prevIds.length || currentIds.some((id, i) => id !== prevIds[i]);

    if (nodes.length > 0 && changed) {
      (async () => {
        await fitView({
          duration: 300,
          includeHiddenNodes: false,
          maxZoom: 1,
          padding: 0.2,
        });
      })();
    }

    prevNodeIdsRef.current = currentIds;
  }, [nodes, fitView]);

  return {
    anchorEl,
    edges,
    graph,
    handleClose,
    handleOpen,
    handleViewerChange,
    isGraphEmpty,
    layoutEngineName,
    minimalGraph,
    nodes,
    onConnect,
    onEdgesChange,
    onNodesChange,
    open,
    setLayoutEngineName,
  };
};

export default useTreegeFlow;
