import MainLayout from "@/components/Layouts/MainLayout/MainLayout";
import DarkTheme from "@/components/Theme/DarkTheme/DarkTheme";
import "@/styles/globals.scss";
import DecisionTreeGenerator from "@/features/DecisionTreeGenerator/DecisionTreeGenerator";

const App = () => (
  <DarkTheme>
    <MainLayout>
      <DecisionTreeGenerator />
    </MainLayout>
  </DarkTheme>
);

export default App;
