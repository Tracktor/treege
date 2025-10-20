import { Background, BackgroundVariant, Controls, MiniMap, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import Logo from "@/editor/components/data-display/logo";
import { edgeTypes } from "@/editor/constants/edgeTypes";
import { nodeTypes } from "@/editor/constants/nodeTypes";
import ActionsPanel from "@/editor/features/TreegeEditor/panel/ActionsPanel";
import NodeActionsSheet from "@/editor/features/TreegeEditor/sheets/NodeActionsSheet";
import useFlowConnections from "@/editor/hooks/useFlowConnections";
import { TreegeEditorProps } from "@/editor/types/editor";
import { Toaster } from "@/shared/components/ui/sonner";
import { ThemeProvider } from "@/shared/context/ThemeContext";

import "@/editor/styles/style.css";

const Flow = ({ defaultEdges, defaultNodes, defaultFlow, onExportJson, onSave }: TreegeEditorProps) => {
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

const TreegeEditor = ({ defaultEdges, defaultNodes, defaultFlow, onExportJson, onSave }: TreegeEditorProps) => (
  <ThemeProvider defaultTheme="dark">
    <Toaster position="bottom-center" />
    <ReactFlowProvider>
      <Flow defaultEdges={defaultEdges} defaultNodes={defaultNodes} onExportJson={onExportJson} onSave={onSave} defaultFlow={defaultFlow} />
    </ReactFlowProvider>
  </ThemeProvider>
);

export default TreegeEditor;
