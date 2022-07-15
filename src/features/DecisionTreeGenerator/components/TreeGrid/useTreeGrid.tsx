import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";

const useTreeGrid = () => {
  const { t } = useTranslation("modal");
  const { tree, currentHierarchyPointNode, modalOpen, setModalOpen } = useContext(DecisionTreeGeneratorContext);
  const isEditModal = modalOpen === "edit";
  const isAddModal = modalOpen === "add";
  const isModalMutationOpen = isEditModal || isAddModal;

  const getTitleModalMutation = () => {
    const name = currentHierarchyPointNode?.data.name;

    return isEditModal ? t("editTitle", { name }) : t("addTitle", { name });
  };

  const getTitleModalDelete = () => {
    const name = currentHierarchyPointNode?.data.name;

    return t("deleteTitle", { name });
  };

  const closeModal = () => setModalOpen(null);

  const handleOnSave = () => {
    window.parent.postMessage({ source: "treege", tree, type: "onSave" }, "*");
  };

  return { closeModal, getTitleModalDelete, getTitleModalMutation, handleOnSave, isModalMutationOpen };
};

export default useTreeGrid;
