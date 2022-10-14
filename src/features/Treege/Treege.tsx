import DarkTheme from "@/components/Theme/DarkTheme/DarkTheme";
import AuthProvider from "@/context/Auth/AuthProvider";
import TreeGrid from "@/features/Treege/components/TreeGrid/TreeGrid";
import TreegeProvider from "@/features/Treege/context/TreegeProvider";
import "@/config/i18n";

interface TreegeProps {
  authToken?: string;
  endPoint?: string;
}

const Treege = ({ authToken, endPoint }: TreegeProps) => (
  <AuthProvider token={authToken}>
    <DarkTheme>
      <TreegeProvider endPoint={endPoint}>
        <TreeGrid />
      </TreegeProvider>
    </DarkTheme>
  </AuthProvider>
);

export default Treege;
