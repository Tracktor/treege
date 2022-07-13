import MainLayout from "@/components/Layouts/MainLayout/MainLayout";
import DarkTheme from "@/components/Theme/DarkTheme/DarkTheme";
import DecisionTreeGenerator from "@/features/DecisionTreeGenerator/DecisionTreeGenerator";
import "@/styles/globals.scss";
import "@/i18n";

const App = () => (
  <DarkTheme>
    <MainLayout>
      <DecisionTreeGenerator />
    </MainLayout>
  </DarkTheme>
);

export default App;
