import type { SelectChangeEvent } from "@tracktor/design-system";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { resetTree, setTree } from "@/features/Treege/reducer/treeReducer";
import useSnackbar from "@/hooks/useSnackbar";
import useTreegeContext from "@/hooks/useTreegeContext";
import useWorkflowQuery from "@/services/workflows/query/useWorkflowQuery";
import useWorkflowsQuery from "@/services/workflows/query/useWorkflowsQuery";

interface useTreeSelectProps {
  isControlled: boolean;
  fetchWorkflowsOnOpen?: boolean;
}

const useTreeSelect = ({ isControlled, fetchWorkflowsOnOpen }: useTreeSelectProps) => {
  const { t } = useTranslation("snackMessage");
  const { open } = useSnackbar();
  const { currentTree, setCurrentTree, dispatchTree } = useTreegeContext();
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
    enabled: !fetchWorkflowsOnOpen,
    keepPreviousData: true,
    onError: () => {
      open(t("error.fetchTree", { ns: "snackMessage" }), "error");
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

  const handleOnOpen = useCallback(() => refetchWorkflows(), [refetchWorkflows]);

  return {
    currentTree,
    fetchWorkflowSuggestions: refetchWorkflows,
    handleChangeTree,
    handleOnOpen,
    setTreeSelected,
    treeSelected,
    workflowsSuggestions: workflows,
    workflowsSuggestionsLoading,
  };
};

export default useTreeSelect;
