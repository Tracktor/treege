import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";

const useTreeGrid = () => {
  const { currentHierarchyPointNode, modalOpen, setModalOpen } = useContext(TreegeContext);
  const { t } = useTranslation(["modal", "snackMessage"]);
  const isEditModal = modalOpen === "edit";
  const isAddModal = modalOpen === "add";
  const isDeleteModal = modalOpen === "delete";
  const isModalMutationOpen = isEditModal || isAddModal;

  const closeModal = () => setModalOpen(null);

  const getTitleModalMutation = () => {
    const name = currentHierarchyPointNode?.data?.attributes.label;

    if (!name) {
      return t("addFirstTitle", { name, ns: "modal" });
    }

    const translateKey = isEditModal ? "editTitle" : "addTitle";

    return t(translateKey, { name, ns: "modal" });
  };

  const getTitleModalDelete = () => {
    const name = currentHierarchyPointNode?.data?.attributes?.label;

    return t("deleteTitle", { name, ns: "modal" });
  };

  return {
    closeModal,
    getTitleModalDelete,
    getTitleModalMutation,
    isDeleteModal,
    isModalMutationOpen,
  };
};

export default useTreeGrid;
