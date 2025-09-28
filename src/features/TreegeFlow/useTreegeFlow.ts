import type { TreeNode } from "@tracktor/types-treege";
import { useReactFlow } from "@xyflow/react";
import { MouseEvent, useEffect, useRef, useState } from "react";
import EdgeFactory from "@/features/TreegeFlow/Edges/EdgeFactory";
import NodeFactory from "@/features/TreegeFlow/Nodes/NodeFactory";
import reactFlowToTreeGraph from "@/features/TreegeFlow/utils/toTreeGraphConverter";
import treegeTreeToTreegeFlowConverter from "@/features/TreegeFlow/utils/treegeTreeToTreegeFlowConverter";
import { TreeGraph } from "@/features/TreegeFlow/utils/types";
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

export const isTreeNode = (obj: unknown): obj is TreeNode =>
  typeof obj === "object" && obj !== null && "attributes" in obj && "children" in obj;

const useTreegeFlow = () => {
  const prevNodeIdsRef = useRef<string[]>([]);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    graph,
    onConnect,
    setGraph,
    layoutEngineName,
    setLayoutEngineName,
    orientation,
    setOrientation,
  } = useTreegeFlowContext();
  const { fitView } = useReactFlow();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const minimalGraph = reactFlowToTreeGraph(nodes, edges);
  const isGraphEmpty = !graph?.nodes || graph.nodes.length === 0;
  const open = !!anchorEl;

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewerChange = (value: string) => {
    const parsed = JSON.parse(value);

    if (isTreeNode(parsed)) {
      const newGraph: TreeGraph = treegeTreeToTreegeFlowConverter(parsed);
      prevNodeIdsRef.current = [];
      return setGraph(newGraph);
    }

    prevNodeIdsRef.current = [];
    return setGraph(parsed);
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
    orientation,
    setLayoutEngineName,
    setOrientation,
  };
};

export default useTreegeFlow;
