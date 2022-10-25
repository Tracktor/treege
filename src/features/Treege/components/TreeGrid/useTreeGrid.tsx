import type { SelectChangeEvent } from "design-system-tracktor";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";
import { resetTree, setTree } from "@/features/Treege/reducer/treeReducer";
import useSnackbar from "@/hooks/useSnackbar/useSnackbar";
import useAddWorkflowsMutation from "@/services/workflows/mutation/useAddWorkflowsMutation";
import useEditWorkflowsMutation from "@/services/workflows/mutation/useEditWorkflowsMutation";
import useWorkflowQuery from "@/services/workflows/query/useWorkflowQuery";

const useTreeGrid = () => {
  const { currentHierarchyPointNode, modalOpen, setModalOpen, dispatchTree, currentTree, setCurrentTree, tree } = useContext(TreegeContext);
  const { t } = useTranslation(["modal", "snackMessage"]);
  const { open } = useSnackbar();
  const [treeSelected, setTreeSelected] = useState("");
  const isEditModal = modalOpen === "edit";
  const isAddModal = modalOpen === "add";
  const isDeleteModal = modalOpen === "delete";
  const isModalMutationOpen = isEditModal || isAddModal;
  const workflowId = treeSelected || String(currentTree.id);

  const { data: workflow } = useWorkflowQuery(workflowId, {
    enabled: !!workflowId,
    onError: () => open(t("error.fetchTree", { ns: "snackMessage" }), "error"),
    refetchOnWindowFocus: false,
  });

  const { mutate: addWorkflowMutate } = useAddWorkflowsMutation({
    onError: () => {
      open(t("error.saveTree", { ns: "snackMessage" }), "error");
    },
    onSuccess: (data) => {
      open(t("success.saveTree", { ns: "snackMessage" }));
      setCurrentTree((prevState) => ({ ...prevState, id: data.workflow_id }));
    },
  });

  const { mutate: editWorkflowMutate } = useEditWorkflowsMutation({
    onError: () => {
      open(t("error.updateTree", { ns: "snackMessage" }), "error");
    },
    onSuccess: () => {
      open(t("success.updateTree", { ns: "snackMessage" }));
    },
  });

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

  const handleChangeTree = ({ target }: SelectChangeEvent) => {
    const { value } = target;

    if (value === "add-new-tree") {
      setTreeSelected("");
      setCurrentTree({ name: "" });
      dispatchTree(resetTree());
      return;
    }

    setTreeSelected(value);
  };

  const handleSubmit = () => {
    const { name, id } = currentTree;

    if (!name) {
      setCurrentTree((prevState) => ({ ...prevState, errorName: "Champs Requis" }));
      return;
    }

    if (tree) {
      if (id) {
        editWorkflowMutate({ id, label: name, workflow: tree });
        return;
      }

      addWorkflowMutate({ label: name, workflow: tree });
    }
  };

  useEffect(() => {
    if (workflow) {
      dispatchTree(setTree(workflow.workflow));
      setCurrentTree({ id: workflow.id, name: workflow.label });
    }
  }, [dispatchTree, setCurrentTree, workflow]);

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
