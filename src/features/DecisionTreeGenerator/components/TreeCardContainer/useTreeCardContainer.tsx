import type { HierarchyPointNode } from "d3-hierarchy";
import { useContext } from "react";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

const useTreeCardContainer = () => {
  const { setModalOpen, setCurrentHierarchyPointNode, setTreeModalOpen, setTreePath } = useContext(DecisionTreeGeneratorContext);

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

  const handleOpenTreeModal = (hierarchyPointNode: HierarchyPointNode<TreeNode>) => {
    const currentTree = {
      label: hierarchyPointNode?.data.attributes.label,
      path: hierarchyPointNode?.data?.attributes?.treePath || "",
    };

    setTreePath((prevState) => [...prevState, currentTree]);
    setTreeModalOpen(true);

    // TO REMOVE
    setCurrentHierarchyPointNode(hierarchyPointNode);
  };

  const handleCloseTreeModal = () => {
    setTreePath([]);
    setTreeModalOpen(false);
  };

  return { handleAddChildren, handleCloseTreeModal, handleDeleteChildren, handleEditChildren, handleOpenTreeModal };
};
export default useTreeCardContainer;
