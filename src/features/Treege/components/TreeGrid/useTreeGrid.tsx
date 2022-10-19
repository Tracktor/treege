import type { SelectChangeEvent } from "design-system-tracktor";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";
import { resetTree } from "@/features/Treege/reducer/treeReducer";
import useAddWorkflowsMutation from "@/services/workflows/mutation/useAddWorkflowsMutation";

const useTreeGrid = () => {
  const { t } = useTranslation("modal");
  const { currentHierarchyPointNode, modalOpen, setModalOpen, dispatchTree, currentTree, setCurrentTree, tree } = useContext(TreegeContext);
  const { mutate } = useAddWorkflowsMutation();
  const [treeSelected, setTreeSelected] = useState("");
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
      setCurrentTree({ name: "" });

      return;
    }
    console.log(value);
    setTreeSelected(value);
    // TODO get tree from api and set current tree name & id
    // dispatchTree(setTree(TreeData[Number(value) - 1].value));
    // setCurrentTree({ name, id });
  };

  const handleSubmit = () => {
    const { name } = currentTree;

    if (!name) {
      setCurrentTree((prevState) => ({ ...prevState, errorName: "Champs Requis" }));
      return;
    }

    if (tree) {
      mutate({ label: name, workflow: tree });
      // TODO set current tree id
      // setCurrentTree((prevState) => ({ ...prevState, id: treeId }));
    }
  };

  return {
    closeModal,
    getTitleModalDelete,
    getTitleModalMutation,
    handleChangeTree,
    handleSubmit,
    isDeleteModal,
    isModalMutationOpen,
    treeSelected,
  };
};

export default useTreeGrid;
