import DarkTheme from "@/components/Theme/DarkTheme/DarkTheme";
import DecisionTreeGenerator from "@/features/DecisionTreeGenerator/DecisionTreeGenerator";
import "@/styles/globals.scss";
import "@/config/i18n";

const App = () => (
  <DarkTheme>
    <DecisionTreeGenerator />
  </DarkTheme>
);

export default App;
