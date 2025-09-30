import { Background, BackgroundVariant, Controls, Edge, MiniMap, Node, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { nanoid } from "nanoid";
import nodeTypes from "@/constants/nodeTypes";
import ActionsSheets from "@/features/Treege/Sheets/ActionsSheets";
import useFlowInteractions from "@/hooks/useFlowInteractions";

import "@xyflow/react/dist/style.css";

interface TreegeProps {
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
}

const initialNodes: Node[] = [
  {
    data: {
      label: "Node 1",
    },
    id: nanoid(),
    position: { x: 0, y: 0 },
    type: "default",
  },
];

const Flow = ({ defaultEdges, defaultNodes }: TreegeProps) => {
  const { onConnect, onConnectEnd, onNodeDragStart } = useFlowInteractions();

  return (
    <ReactFlow
      fitView
      colorMode="dark"
      nodeTypes={nodeTypes}
      defaultEdges={defaultEdges || []}
      defaultNodes={defaultNodes || initialNodes}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      onNodeDragStart={onNodeDragStart}
    >
      <Background gap={10} variant={BackgroundVariant.Dots} />
      <MiniMap />
      <Controls />
      <ActionsSheets />
    </ReactFlow>
  );
};

const Treege = ({ defaultEdges, defaultNodes }: TreegeProps) => (
  <ReactFlowProvider>
    <Flow defaultEdges={defaultEdges} defaultNodes={defaultNodes} />
  </ReactFlowProvider>
);

export default Treege;
