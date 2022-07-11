import type { HierarchyPointNode } from "d3-hierarchy";
import { useContext } from "react";
import type { TreeNodeDatum } from "react-d3-tree/lib/types/common";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";

const useTreeCardContainer = () => {
  const { setModalIsOpen, setCurrentHierarchyPointNode } = useContext(DecisionTreeGeneratorContext);

  const handleOnAddChildren = (hierarchyPointNode: HierarchyPointNode<TreeNodeDatum>) => {
    setCurrentHierarchyPointNode(hierarchyPointNode);
    setModalIsOpen(true);
  };

  return { handleOnAddChildren };
};
export default useTreeCardContainer;
