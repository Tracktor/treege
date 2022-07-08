import DecisionTreeGeneratorConsumer from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorConsumer";
import DecisionTreeGeneratorProvider from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorProvider";

const DecisionTreeGenerator = () => (
  <DecisionTreeGeneratorProvider>
    <DecisionTreeGeneratorConsumer />
  </DecisionTreeGeneratorProvider>
);

export default DecisionTreeGenerator;
