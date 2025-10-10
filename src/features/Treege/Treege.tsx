import { Background, BackgroundVariant, Controls, Edge, MiniMap, Node, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { ThemeProvider } from "@/components/theme-provider";
import Logo from "@/components/ui/logo";
import { Toaster } from "@/components/ui/sonner";
import edgeTypes from "@/constants/edgeTypes";
import nodeTypes from "@/constants/nodeTypes";
import ActionsPanel from "@/features/Treege/Panel/ActionsPanel";
import NodeActionsSheet from "@/features/Treege/Sheets/NodeActionsSheet";
import useFlowConnections from "@/hooks/useFlowConnections";

import "@xyflow/react/dist/base.css";

export interface TreegeProps {
  /**
   * Default nodes to initialize the nodes in the flow.
   */
  defaultNodes?: Node[];
  /**
   * Default edges to initialize the edges in the flow.
   */
  defaultEdges?: Edge[];
  /**
   * Default flow structure containing combined nodes and edges.
   */
  defaultFlow?: { nodes: Node[]; edges: Edge[] };
  /**
   * Callback function triggered when exporting JSON data.
   */
  onExportJson?: () => { nodes: Node[]; edges: Edge[] } | undefined;
  /**
   * Callback function triggered when saving the flow data.
   * @param data
   */
  onSave?: (data: { nodes: Node[]; edges: Edge[] }) => void;
}

const Flow = ({ defaultEdges, defaultNodes, defaultFlow, onExportJson, onSave }: TreegeProps) => {
  const { onConnect, onConnectEnd, onEdgesDelete } = useFlowConnections();

  return (
    <ReactFlow
      fitView
      colorMode="dark"
      selectNodesOnDrag={false}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdges={defaultEdges || defaultFlow?.edges || []}
      defaultNodes={defaultNodes || defaultFlow?.nodes || []}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      onEdgesDelete={onEdgesDelete}
    >
      <Background gap={10} variant={BackgroundVariant.Dots} />
      <ActionsPanel onExportJson={onExportJson} onSave={onSave} />
      <Logo />
      <MiniMap />
      <Controls />
      <NodeActionsSheet />
    </ReactFlow>
  );
};

const Treege = ({ defaultEdges, defaultNodes, defaultFlow, onExportJson, onSave }: TreegeProps) => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Toaster position="bottom-center" />
    <ReactFlowProvider>
      <Flow defaultEdges={defaultEdges} defaultNodes={defaultNodes} onExportJson={onExportJson} onSave={onSave} defaultFlow={defaultFlow} />
    </ReactFlowProvider>
  </ThemeProvider>
);

export default Treege;
