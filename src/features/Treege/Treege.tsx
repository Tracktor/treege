import { Background, BackgroundVariant, Controls, Edge, MiniMap, Node, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { ThemeProvider } from "@/components/theme-provider";
import defaultNode from "@/constants/defaultNode";
import edgeTypes from "@/constants/edgeTypes";
import nodeTypes from "@/constants/nodeTypes";
import ActionsSheets from "@/features/Treege/Sheets/ActionsSheets";
import useFlowConnections from "@/hooks/useFlowConnections";

import "@xyflow/react/dist/base.css";

interface TreegeProps {
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
}

const Flow = ({ defaultEdges, defaultNodes }: TreegeProps) => {
  const { onConnect, onConnectEnd } = useFlowConnections();

  return (
    <ReactFlow
      fitView
      colorMode="dark"
      selectNodesOnDrag={false}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdges={defaultEdges || []}
      defaultNodes={defaultNodes || [defaultNode]}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
    >
      <Background gap={10} variant={BackgroundVariant.Dots} />
      <MiniMap />
      <Controls />
      <ActionsSheets />
    </ReactFlow>
  );
};

const Treege = ({ defaultEdges, defaultNodes }: TreegeProps) => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <ReactFlowProvider>
      <Flow defaultEdges={defaultEdges} defaultNodes={defaultNodes} />
    </ReactFlowProvider>
  </ThemeProvider>
);

export default Treege;
