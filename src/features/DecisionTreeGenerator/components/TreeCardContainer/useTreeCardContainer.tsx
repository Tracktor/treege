import type { HierarchyPointNode } from "d3-hierarchy";
import { useContext } from "react";
import type { TreeNodeDatum } from "react-d3-tree/lib/types/common";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";

const useTreeCardContainer = () => {
  const { setModalOpen, setCurrentHierarchyPointNode } = useContext(DecisionTreeGeneratorContext);

  const handleAddChildren = (hierarchyPointNode: HierarchyPointNode<TreeNodeDatum>) => {
    setCurrentHierarchyPointNode(hierarchyPointNode);
    setModalOpen("add");
  };

  const handleDeleteChildren = (hierarchyPointNode: HierarchyPointNode<TreeNodeDatum>) => {
    setCurrentHierarchyPointNode(hierarchyPointNode);
    setModalOpen("delete");
  };

  const handleEditChildren = (hierarchyPointNode: HierarchyPointNode<TreeNodeDatum>) => {
    setCurrentHierarchyPointNode(hierarchyPointNode);
    setModalOpen("edit");
  };

  return { handleAddChildren, handleDeleteChildren, handleEditChildren };
};
export default useTreeCardContainer;
