import TreeGrid from "@/features/DecisionTreeGenerator/components/TreeGrid/TreeGrid";
import DecisionTreeGeneratorProvider from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorProvider";

const DecisionTreeGenerator = () => (
  <DecisionTreeGeneratorProvider>
    <TreeGrid />
  </DecisionTreeGeneratorProvider>
);

export default DecisionTreeGenerator;
