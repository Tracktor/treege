import { useTranslation } from "react-i18next";
import { setTree } from "@/features/Treege/reducer/treeReducer";
import useTreegeContext from "@/hooks/useTreegeContext";

const useTreeGrid = () => {
  const { t } = useTranslation(["modal", "snackMessage"]);
  const { currentHierarchyPointNode, modalOpen, setModalOpen, dispatchTree } = useTreegeContext();
  const isEditModal = modalOpen === "edit";
  const isAddModal = modalOpen === "add";
  const isDeleteModal = modalOpen === "delete";
  const isModalMutationOpen = isEditModal || isAddModal;

  const closeModal = () => {
    setModalOpen(null);
  };

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
    const uuid = currentHierarchyPointNode?.data?.uuid;

    return t("deleteTitle", { name: name || uuid, ns: "modal" });
  };

  const handleChangeTree = (tree: string) => {
    try {
      dispatchTree(setTree(JSON.parse(tree)));
    } catch (e) {
      return false;
    }
    return undefined;
  };

  return {
    closeModal,
    getTitleModalDelete,
    getTitleModalMutation,
    handleChangeTree,
    isDeleteModal,
    isModalMutationOpen,
  };
};

export default useTreeGrid;
