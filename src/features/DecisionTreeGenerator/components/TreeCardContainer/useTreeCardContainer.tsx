import type { HierarchyPointNode } from "d3-hierarchy";
import { useContext } from "react";
import type { TreeNodeDatum } from "react-d3-tree/lib/types/common";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";

const useTreeCardContainer = () => {
  const { setModalMutationIsOpen, setModalDeleteIsOpen, setCurrentHierarchyPointNode } = useContext(DecisionTreeGeneratorContext);

  const handleMutationChildren = (hierarchyPointNode: HierarchyPointNode<TreeNodeDatum>) => {
    setCurrentHierarchyPointNode(hierarchyPointNode);
    setModalMutationIsOpen(true);
  };

  const handleDeleteChildren = (hierarchyPointNode: HierarchyPointNode<TreeNodeDatum>) => {
    setCurrentHierarchyPointNode(hierarchyPointNode);
    setModalDeleteIsOpen(true);
  };

  return { handleDeleteChildren, handleMutationChildren };
};
export default useTreeCardContainer;
