import { QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "@tracktor/design-system";
import type { TreeNode } from "@tracktor/types-treege";
import { ReactFlowProvider } from "@xyflow/react";
import axios from "axios";
import { useLayoutEffect } from "react";
import DarkTheme from "@/components/Theme/DarkTheme/DarkTheme";
import queryConfig from "@/config/query.config";
import AuthProvider from "@/context/Auth/AuthProvider";
import IdProvider from "@/features/Treege/context/IDProvider";
import TreegeProvider from "@/features/Treege/context/TreegeProvider";
import "@/config/i18n.config";
import "@xyflow/react/dist/style.css";
import TreegeFlow from "@/features/Treege/TreegeFlow/TreegeFlow";
import TreegeFlowProvider from "@/features/Treege/context/TreegeFlowProvider";

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

const Treege = ({ initialTree, initialTreeId, backendConfig }: TreegeProps) => {
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
            <IdProvider>
              <DarkTheme>
                <SnackbarProvider>
                  <TreegeFlowProvider>
                    <TreegeFlow />
                  </TreegeFlowProvider>
                </SnackbarProvider>
              </DarkTheme>
            </IdProvider>
          </TreegeProvider>
        </ReactFlowProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default Treege;
