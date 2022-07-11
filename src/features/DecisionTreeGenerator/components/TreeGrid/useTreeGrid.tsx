import { useContext } from "react";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";

const useTreeGrid = () => {
  const { currentHierarchyPointNode } = useContext(DecisionTreeGeneratorContext);

  const getModalSuffix = () => (currentHierarchyPointNode?.data?.name ? `à ${currentHierarchyPointNode?.data.name}` : "");

  return { getModalSuffix };
};

export default useTreeGrid;
