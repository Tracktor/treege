import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";

const useTreeGrid = () => {
  const { t } = useTranslation("modal");
  const { currentHierarchyPointNode, modalOpen, setModalOpen } = useContext(TreegeContext);
  const isEditModal = modalOpen === "edit";
  const isAddModal = modalOpen === "add";
  const isDeleteModal = modalOpen === "delete";
  const isModalSaveOpen = modalOpen === "save";

  const isModalMutationOpen = isEditModal || isAddModal;
  const closeModal = () => setModalOpen(null);

  const getTitleModalMutation = () => {
    const name = currentHierarchyPointNode?.data?.attributes.label;

    if (!name) {
      return t("addFirstTitle", { name });
    }

    const translateKey = isEditModal ? "editTitle" : "addTitle";

    return t(translateKey, { name });
  };

  const getTitleModalDelete = () => {
    const name = currentHierarchyPointNode?.data?.attributes?.label;

    return t("deleteTitle", { name });
  };

  const getTitleModalSave = () => t("saveTree");

  return {
    closeModal,
    getTitleModalDelete,
    getTitleModalMutation,
    getTitleModalSave,
    isDeleteModal,
    isModalMutationOpen,
    isModalSaveOpen,
  };
};

export default useTreeGrid;
