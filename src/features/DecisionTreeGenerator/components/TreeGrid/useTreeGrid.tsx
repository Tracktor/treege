import { useCallback, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import { setTree } from "@/features/DecisionTreeGenerator/reducer/treeReducer";

const useTreeGrid = () => {
  const { t } = useTranslation("modal");
  const { tree, currentHierarchyPointNode, modalOpen, dispatchTree, setModalOpen } = useContext(DecisionTreeGeneratorContext);
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

  const handleOnSave = () => {
    window.parent.postMessage({ source: "treege", tree, type: "onSave" }, "*");
  };

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (event.data?.source === "treege" && event.data?.type === "setTree") {
        dispatchTree(setTree(event.data?.tree));
      }
    },
    [dispatchTree]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handleMessage]);

  return {
    closeModal,
    getTitleModalDelete,
    getTitleModalMutation,
    handleOnSave,
    isDeleteModal,
    isModalMutationOpen,
  };
};

export default useTreeGrid;
