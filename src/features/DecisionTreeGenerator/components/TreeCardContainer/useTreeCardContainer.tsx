import type { HierarchyPointNode } from "d3-hierarchy";
import { useContext } from "react";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

const useTreeCardContainer = () => {
  const { setModalOpen, setCurrentHierarchyPointNode } = useContext(DecisionTreeGeneratorContext);

  const handleAddChildren = (hierarchyPointNode: HierarchyPointNode<TreeNode>) => {
    setCurrentHierarchyPointNode(hierarchyPointNode);
    setModalOpen("add");
  };

  const handleDeleteChildren = (hierarchyPointNode: HierarchyPointNode<TreeNode>) => {
    setCurrentHierarchyPointNode(hierarchyPointNode);
    setModalOpen("delete");
  };

  const handleEditChildren = (hierarchyPointNode: HierarchyPointNode<TreeNode>) => {
    setCurrentHierarchyPointNode(hierarchyPointNode);
    setModalOpen("edit");
  };

  return { handleAddChildren, handleDeleteChildren, handleEditChildren };
};
export default useTreeCardContainer;
