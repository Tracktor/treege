import { QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "@tracktor/design-system";
import type { TreeNode } from "@tracktor/types-treege";
import { ReactFlowProvider } from "@xyflow/react";
import axios from "axios";
import { useLayoutEffect } from "react";
import DarkTheme from "@/components/Theme/DarkTheme/DarkTheme";
import queryConfig from "@/config/query.config";
import AuthProvider from "@/context/Auth/AuthProvider";
import TreegeFlowProvider from "@/context/TreegeFlow/TreegeFlowProvider";
import TreegeProvider from "@/context/TreegeTree/TreegeProvider";
import "@/config/i18n.config";
import "@xyflow/react/dist/style.css";
import TreegeFlow from "@/features/TreegeFlow/TreegeFlow";

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
      initialGraph?: never;
    }
  | {
      initialTree?: TreeNode;
      initialTreeId?: never;
      backendConfig?: BackendConfig;
      initialGraph?: never;
    }
  | {
      initialTree?: never;
      initialTreeId?: string;
      backendConfig?: BackendConfig;
      initialGraph?: never;
    };

const Treege = ({ initialTree, initialTreeId, backendConfig, initialGraph }: TreegeProps) => {
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
            <TreegeFlowProvider initialGraph={initialGraph}>
              <DarkTheme>
                <SnackbarProvider>
                  <TreegeFlow />
                </SnackbarProvider>
              </DarkTheme>
            </TreegeFlowProvider>
          </TreegeProvider>
        </ReactFlowProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default Treege;
