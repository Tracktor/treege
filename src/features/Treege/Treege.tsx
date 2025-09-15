import { QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "@tracktor/design-system";
import type { TreeNode } from "@tracktor/types-treege";
import axios from "axios";
import { useLayoutEffect } from "react";
import { Node, Edge, useNodesState, useEdgesState, ReactFlowProvider } from "reactflow";
import DarkTheme from "@/components/Theme/DarkTheme/DarkTheme";
import queryConfig from "@/config/query.config";
import AuthProvider from "@/context/Auth/AuthProvider";
import TreegeProvider from "@/features/Treege/context/TreegeProvider";
import "@/config/i18n.config";
import "reactflow/dist/style.css";
import TreegeFlow from "@/features/Treege/TreegeFlow/TreegeFlow";

export interface BackendConfig {
  baseUrl?: string;
  authToken?: string;
  endpoints?: {
    workflow?: string;
    workflows?: string;
  };
}

type TreegeProps =
  | {
      initialTree?: never;
      initialTreeId?: never;
      backendConfig?: BackendConfig;
    }
  | {
      initialTree?: TreeNode;
      initialTreeId?: never;
      backendConfig?: BackendConfig;
    }
  | {
      initialTree?: never;
      initialTreeId?: string;
      backendConfig?: BackendConfig;
    };

export type CustomNodeData = {
  label: string;
};

const initialNodes: Node<CustomNodeData>[] = [
  {
    data: { label: "Hello" },
    id: "1",
    position: { x: 0, y: 0 },
    type: "input",
  },
];

const initialEdges: Edge[] = [];

const Treege = ({ initialTree, initialTreeId, backendConfig }: TreegeProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useLayoutEffect(() => {
    axios.defaults.baseURL = backendConfig?.baseUrl;
    if (backendConfig?.authToken) {
      axios.defaults.headers.common.Authorization = `Bearer ${backendConfig?.authToken}`;
    }
  }, [backendConfig?.authToken, backendConfig?.baseUrl]);

  return (
    <QueryClientProvider client={queryConfig}>
      <AuthProvider authToken={backendConfig?.authToken}>
        <ReactFlowProvider>
          <TreegeProvider backendConfig={backendConfig} initialTree={initialTree} initialTreeId={initialTreeId}>
            <DarkTheme>
              <SnackbarProvider>
                <TreegeFlow
                  nodes={nodes}
                  setNodes={setNodes}
                  onNodesChange={onNodesChange}
                  edges={edges}
                  setEdges={setEdges}
                  onEdgesChange={onEdgesChange}
                />
              </SnackbarProvider>
            </DarkTheme>
          </TreegeProvider>
        </ReactFlowProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default Treege;
