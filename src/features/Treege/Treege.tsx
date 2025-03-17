import { QueryClientProvider } from "@tanstack/react-query";
import { TreeNode } from "@tracktor/types-treege";
import axios from "axios";
import { useLayoutEffect } from "react";
import DarkTheme from "@/components/Theme/DarkTheme/DarkTheme";
import queryConfig from "@/config/query.config";
import AuthProvider from "@/context/Auth/AuthProvider";
import SnackbarProvider from "@/context/Snackbar/SnackbarProvider";
import TreeGrid from "@/features/Treege/components/TreeGrid/TreeGrid";
import TreegeProvider from "@/features/Treege/context/TreegeProvider";
import "@/config/i18n.config";

export interface BackendConfig {
  baseUrl: string;
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
        <TreegeProvider backendConfig={backendConfig} initialTree={initialTree} initialTreeId={initialTreeId}>
          <DarkTheme>
            <SnackbarProvider>
              <TreeGrid />
            </SnackbarProvider>
          </DarkTheme>
        </TreegeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default Treege;
