import DarkTheme from "@/components/Theme/DarkTheme/DarkTheme";
import TreeGrid from "@/features/Treege/components/TreeGrid/TreeGrid";
import TreegeProvider from "@/features/Treege/context/TreegeProvider";

const Treege = () => (
  <DarkTheme>
    <TreegeProvider>
      <TreeGrid />
    </TreegeProvider>
  </DarkTheme>
);

export default Treege;