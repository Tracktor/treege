import "@/editor/styles/style.css";
import { Background, BackgroundVariant, Controls, MiniMap, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import Logo from "@/editor/components/data-display/logo";
import { edgeTypes } from "@/editor/constants/edgeTypes";
import { nodeTypes } from "@/editor/constants/nodeTypes";
import { TreegeEditorProvider } from "@/editor/context/TreegeEditorContext";
import ActionsPanel from "@/editor/features/TreegeEditor/panel/ActionsPanel";
import NodeActionsSheet from "@/editor/features/TreegeEditor/sheets/NodeActionsSheet";
import useFlowConnections from "@/editor/hooks/useFlowConnections";
import { TreegeEditorProps } from "@/editor/types/editor";
import { Toaster } from "@/shared/components/ui/sonner";
import { ThemeProvider } from "@/shared/context/ThemeContext";

const Flow = ({ flow, onExportJson, onSave, theme }: TreegeEditorProps) => {
  const { onConnect, onConnectEnd, onEdgesDelete, isValidConnection } = useFlowConnections();

  return (
    <ReactFlow
      fitView
      colorMode={theme}
      selectNodesOnDrag={false}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdges={flow?.edges || []}
      defaultNodes={flow?.nodes || []}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      onEdgesDelete={onEdgesDelete}
      isValidConnection={isValidConnection}
    >
      <Background gap={10} variant={BackgroundVariant.Dots} />
      <ActionsPanel onExportJson={onExportJson} onSave={onSave} />
      <Logo theme={theme} />
      <MiniMap />
      <Controls />
      <NodeActionsSheet />
    </ReactFlow>
  );
};

const TreegeEditor = ({ flow, onExportJson, onSave, theme = "dark", language = "en" }: TreegeEditorProps) => (
  <ThemeProvider defaultTheme={theme} storageKey="treege-editor-theme" theme={theme}>
    <TreegeEditorProvider value={{ flowId: flow?.id, language }}>
      <Toaster position="bottom-center" />
      <ReactFlowProvider>
        <Flow onExportJson={onExportJson} onSave={onSave} flow={flow} theme={theme} />
      </ReactFlowProvider>
    </TreegeEditorProvider>
  </ThemeProvider>
);

export default TreegeEditor;
