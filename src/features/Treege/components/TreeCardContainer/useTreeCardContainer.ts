import type { TreeNode } from "@tracktor/types-treege";
import type { HierarchyPointNode } from "d3-hierarchy";
import useTreegeContext from "@/hooks/useTreegeContext";

const useTreeCardContainer = () => {
  const { setModalOpen, setCurrentHierarchyPointNode, setTreeModalOpen, setTreePath } = useTreegeContext();

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
      label: hierarchyPointNode?.data.attributes?.label || "",
      path: hierarchyPointNode?.data?.attributes?.treePath || "",
    };

    setTreePath((prevState) => [...prevState, currentTree]);
    setTreeModalOpen(true);
  };

  const handleCloseTreeModal = () => {
    setTreePath([]);
    setTreeModalOpen(false);
  };

  return {
    handleAddChildren,
    handleCloseTreeModal,
    handleDeleteChildren,
    handleEditChildren,
    handleOpenTreeModal,
  };
};
export default useTreeCardContainer;
