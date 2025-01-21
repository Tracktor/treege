import { useTranslation } from "react-i18next";
import { setTree } from "@/features/Treege/reducer/treeReducer";
import useTreegeContext from "@/hooks/useTreegeContext";

const useTreeGrid = () => {
  const { t } = useTranslation(["modal", "snackMessage"]);
  const { currentHierarchyPointNode, modalOpen, setModalOpen, dispatchTree, setTreePath, setTreeModalOpen } = useTreegeContext();
  const isEditModal = modalOpen === "edit";
  const isAddModal = modalOpen === "add";
  const isDeleteModal = modalOpen === "delete";
  const isModalMutationOpen = isEditModal || isAddModal;

  const closeModal = () => {
    setModalOpen(null);
  };

  const getTitleModalMutation = () => {
    const { label, name } = currentHierarchyPointNode?.data?.attributes || {};

    if (!isEditModal) {
      return t("addFirstTitle", { ns: "modal" });
    }

    const translateKey = isEditModal ? "editTitle" : "addTitle";

    return t(translateKey, { name: label || name, ns: "modal" });
  };

  const getTitleModalDelete = () => {
    const { label, name } = currentHierarchyPointNode?.data?.attributes || {};

    return t("deleteTitle", { name: label || name, ns: "modal" });
  };

  const handleChangeTree = (tree: string) => {
    try {
      dispatchTree(setTree(JSON.parse(tree)));
    } catch (e) {
      return false;
    }
    return undefined;
  };

  const handleCloseTreeModal = () => {
    setTreePath([]);
    setTreeModalOpen(false);
  };

  return {
    closeModal,
    getTitleModalDelete,
    getTitleModalMutation,
    handleChangeTree,
    handleCloseTreeModal,
    isDeleteModal,
    isModalMutationOpen,
  };
};

export default useTreeGrid;
