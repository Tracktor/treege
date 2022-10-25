import axios from "axios";
import { useLayoutEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import DarkTheme from "@/components/Theme/DarkTheme/DarkTheme";
import AuthProvider from "@/context/Auth/AuthProvider";
import SnackbarProvider from "@/context/Snackbar/SnackbarProvider";
import TreeGrid from "@/features/Treege/components/TreeGrid/TreeGrid";
import TreegeProvider from "@/features/Treege/context/TreegeProvider";
import type { TreeNode } from "@/features/Treege/type/TreeNode";
import "@/config/i18n";

type TreegeProps =
  | {
      authToken?: string;
      endPoint?: string;
      initialTree?: never;
      initialTreeId?: never;
    }
  | {
      authToken?: string;
      endPoint?: string;
      initialTree: TreeNode;
      initialTreeId: string;
    };

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const Treege = ({ authToken, endPoint, initialTree, initialTreeId }: TreegeProps) => {
  useLayoutEffect(() => {
    axios.defaults.baseURL = endPoint;
    axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;
  }, [endPoint, authToken]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider authToken={authToken}>
        <TreegeProvider endPoint={endPoint} initialTree={initialTree} initialTreeId={initialTreeId}>
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
