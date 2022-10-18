import { QueryClient, QueryClientProvider } from "react-query";
import DarkTheme from "@/components/Theme/DarkTheme/DarkTheme";
import AuthProvider from "@/context/Auth/AuthProvider";
import FlashMessageProvider from "@/context/FlashMessage/FlashMessageProvider";
import TreeGrid from "@/features/Treege/components/TreeGrid/TreeGrid";
import TreegeProvider from "@/features/Treege/context/TreegeProvider";
import type { TreeNode } from "@/features/Treege/type/TreeNode";
import "@/config/i18n";

interface TreegeProps {
  authToken?: string;
  endPoint?: string;
  initialTree?: TreeNode;
}

const queryClient = new QueryClient();
const Treege = ({ authToken, endPoint, initialTree }: TreegeProps) => (
  <FlashMessageProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider authToken={authToken}>
        <DarkTheme>
          <TreegeProvider endPoint={endPoint} initialTree={initialTree}>
            <TreeGrid />
          </TreegeProvider>
        </DarkTheme>
      </AuthProvider>
    </QueryClientProvider>
  </FlashMessageProvider>
);

export default Treege;
