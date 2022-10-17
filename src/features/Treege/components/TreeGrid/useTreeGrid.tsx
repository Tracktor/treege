import type { SelectChangeEvent } from "design-system-tracktor";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import TreeData from "@/constants/TreeData";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";
import { resetTree, setTree } from "@/features/Treege/reducer/treeReducer";

const useTreeGrid = () => {
  const { t } = useTranslation("modal");
  const { currentHierarchyPointNode, modalOpen, setModalOpen, dispatchTree } = useContext(TreegeContext);
  const [treeSelected, setTreeSelected] = useState<string>("");
  const isEditModal = modalOpen === "edit";
  const isAddModal = modalOpen === "add";
  const isDeleteModal = modalOpen === "delete";
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

  const handleChangeTree = ({ target }: SelectChangeEvent) => {
    const { value } = target;

    if (value === "add-new-tree") {
      setTreeSelected("");
      dispatchTree(resetTree());
      return;
    }

    setTreeSelected(value);
    dispatchTree(setTree(TreeData[Number(value) - 1].value)); // TODO get tree from api
  };

  return {
    closeModal,
    getTitleModalDelete,
    getTitleModalMutation,
    handleChangeTree,
    isDeleteModal,
    isModalMutationOpen,
    treeSelected,
  };
};

export default useTreeGrid;
