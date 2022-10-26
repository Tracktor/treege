import type { SelectChangeEvent } from "design-system-tracktor";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";
import { resetTree, setTree } from "@/features/Treege/reducer/treeReducer";
import useSnackbar from "@/hooks/useSnackbar/useSnackbar";
import useWorkflowQuery from "@/services/workflows/query/useWorkflowQuery";
import useWorkflowsQuery from "@/services/workflows/query/useWorkflowsQuery";

const useTreeSelect = (isControlled: boolean) => {
  const { t } = useTranslation("snackMessage");
  const { open } = useSnackbar();
  const { currentTree, setCurrentTree, dispatchTree } = useContext(TreegeContext);
  const [treeSelected, setTreeSelected] = useState("");

  useWorkflowQuery(treeSelected, {
    enabled: !!treeSelected && !isControlled && treeSelected !== currentTree.id,
    onError: () => open(t("error.fetchTree", { ns: "snackMessage" }), "error"),
    onSuccess: ({ id, label, workflow }) => {
      if (isControlled) return;
      setCurrentTree({ id, name: label });
      dispatchTree(setTree(workflow));
    },
  });

  const {
    data: workflows,
    isLoading: workflowsSuggestionsLoading,
    refetch: refetchWorkflows,
  } = useWorkflowsQuery({
    enabled: false,
    keepPreviousData: true,
    onError: () => {
      open(t("error.fetchTree"), "error");
    },
    onSuccess: () => {
      if (currentTree.id && !treeSelected) {
        setTreeSelected(currentTree.id);
      }
    },
  });

  const handleChangeTree = async ({ target }: SelectChangeEvent) => {
    const { value } = target;

    if (value === "add-new-tree") {
      setTreeSelected("");
      setCurrentTree({ name: "" });
      dispatchTree(resetTree());
      return;
    }

    setTreeSelected(value);
  };

  const handleOnOpen = () => fetchWorkflowSuggestions();

  const fetchWorkflowSuggestions = () => refetchWorkflows();

  return {
    currentTree,
    fetchWorkflowSuggestions,
    handleChangeTree,
    handleOnOpen,
    setTreeSelected,
    treeSelected,
    workflowsSuggestions: workflows,
    workflowsSuggestionsLoading,
  };
};

export default useTreeSelect;
