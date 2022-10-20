import type { SelectChangeEvent } from "design-system-tracktor";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";
import { resetTree, setTree } from "@/features/Treege/reducer/treeReducer";
import useSnackbar from "@/hooks/useSnackbar/useSnackbar";
import useAddWorkflowsMutation from "@/services/workflows/mutation/useAddWorkflowsMutation";
import useEditWorkflowsMutation from "@/services/workflows/mutation/useEditWorkflowsMutation";
import useWorkflowQueryFetcher from "@/services/workflows/query/useWorkflowQueryFetcher";

const useTreeGrid = () => {
  const { t } = useTranslation(["modal", "snackMessage"]);
  const { currentHierarchyPointNode, modalOpen, setModalOpen, dispatchTree, currentTree, setCurrentTree, tree } = useContext(TreegeContext);
  const { handleOpenSnackbar } = useSnackbar();
  const [treeSelected, setTreeSelected] = useState("");
  const isEditModal = modalOpen === "edit";
  const isAddModal = modalOpen === "add";
  const isDeleteModal = modalOpen === "delete";
  const isModalMutationOpen = isEditModal || isAddModal;

  const { getWorkflow } = useWorkflowQueryFetcher();

  const { data: workflow } = useQuery(["/v1/workflow", treeSelected], () => getWorkflow(treeSelected), {
    enabled: !!treeSelected,
    onError: () => {
      handleOpenSnackbar(t("error.fetchTree", { ns: "snackMessage" }), "error");
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (workflow) {
      dispatchTree(setTree(workflow.workflow));
      setCurrentTree({ id: workflow.id, name: workflow.label });
    }
  }, [dispatchTree, setCurrentTree, workflow]);

  const { mutate: addWorkflowMutate } = useAddWorkflowsMutation({
    onError: () => {
      handleOpenSnackbar(t("error.saveTree", { ns: "snackMessage" }), "error");
    },
    onSuccess: (data) => {
      handleOpenSnackbar(t("success.saveTree", { ns: "snackMessage" }));
      setCurrentTree((prevState) => ({ ...prevState, id: data.workflow_id }));
    },
  });

  const { mutate: editWorkflowMutate } = useEditWorkflowsMutation({
    onError: () => {
      handleOpenSnackbar(t("error.updateTree", { ns: "snackMessage" }), "error");
    },
    onSuccess: () => {
      handleOpenSnackbar(t("success.updateTree", { ns: "snackMessage" }));
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
      dispatchTree(resetTree());
      setCurrentTree({ name: "" });

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
