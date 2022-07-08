import DecisionTreeGeneratorProvider from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorProvider";
import TreeGrid from "@/features/DecisionTreeGenerator/TreeGrid/TreeGrid";

const DecisionTreeGenerator = () => (
  <DecisionTreeGeneratorProvider>
    <TreeGrid />
  </DecisionTreeGeneratorProvider>
);

export default DecisionTreeGenerator;
