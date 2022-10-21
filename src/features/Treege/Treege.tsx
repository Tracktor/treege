import axios from "axios";
import { QueryClient, QueryClientProvider } from "react-query";
import DarkTheme from "@/components/Theme/DarkTheme/DarkTheme";
import AuthProvider from "@/context/Auth/AuthProvider";
import SnackbarProvider from "@/context/Snackbar/SnackbarProvider";
import TreeGrid from "@/features/Treege/components/TreeGrid/TreeGrid";
import TreegeProvider from "@/features/Treege/context/TreegeProvider";
import type { TreeNode } from "@/features/Treege/type/TreeNode";
import "@/config/i18n";

interface TreegeProps {
  authToken?: string;
  endPoint?: string;
  initialTree?: TreeNode;
}

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const Treege = ({ authToken, endPoint, initialTree }: TreegeProps) => {
  axios.defaults.baseURL = endPoint;
  axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;

  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <AuthProvider authToken={authToken}>
          <TreegeProvider endPoint={endPoint} initialTree={initialTree}>
            <DarkTheme>
              <TreeGrid />
            </DarkTheme>
          </TreegeProvider>
        </AuthProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
};

export default Treege;
