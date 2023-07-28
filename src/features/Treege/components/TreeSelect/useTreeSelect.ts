import type { SelectChangeEvent } from "@tracktor/design-system";
import { useCallback, useEffect, useState } from "react";
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

  const { data: workflowData } = useWorkflowQuery(treeSelected, {
    enabled: !!treeSelected && !isControlled && treeSelected !== currentTree.id,
    onError: () => open(t("error.fetchTree", { ns: "snackMessage" }), "error"),
  });

  const {
    data: workflows,
    isLoading: workflowsSuggestionsLoading,
    refetch: refetchWorkflows,
  } = useWorkflowsQuery({
    enabled: !fetchWorkflowsOnOpen,
  });

  const handleChangeTree = useCallback(
    async ({ target }: SelectChangeEvent) => {
      const { value } = target;

      if (value === "add-new-tree") {
        setTreeSelected("");
        setCurrentTree({ name: "" });
        dispatchTree(resetTree());
        return;
      }

      setTreeSelected(value);
    },
    [dispatchTree, setCurrentTree]
  );

  const handleOnOpen = useCallback(async () => {
    if (!fetchWorkflowsOnOpen) return;

    try {
      await refetchWorkflows();

      if (currentTree.id && !treeSelected) {
        setTreeSelected(currentTree.id);
      }
    } catch (error) {
      open(t("error.fetchTree", { ns: "snackMessage" }), "error");
    }
  }, [currentTree.id, fetchWorkflowsOnOpen, open, refetchWorkflows, t, treeSelected]);

  // Set current tree when treeSelected is changed
  useEffect(() => {
    if (treeSelected !== currentTree.id && workflowData) {
      const { id, label, workflow } = workflowData;

      setCurrentTree({ id, name: label });
      dispatchTree(setTree(workflow));
    }
  }, [currentTree.id, dispatchTree, isControlled, setCurrentTree, treeSelected, workflowData]);

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
