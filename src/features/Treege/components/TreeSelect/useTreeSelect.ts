import { SelectChangeEvent, useSnackbar } from "@tracktor/design-system";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { resetTree, setTree } from "@/features/Treege/reducer/treeReducer";
import useTreegeContext from "@/hooks/useTreegeContext";
import useWorkflowQuery from "@/services/workflows/query/useWorkflowQuery";
import useWorkflowsQuery from "@/services/workflows/query/useWorkflowsQuery";

interface useTreeSelectProps {
  isControlled: boolean;
  fetchWorkflowsOnOpen?: boolean;
}

const useTreeSelect = ({ isControlled, fetchWorkflowsOnOpen }: useTreeSelectProps) => {
  const { t } = useTranslation("snackMessage");
  const { openSnackbar } = useSnackbar();
  const { currentTree, setCurrentTree, dispatchTree } = useTreegeContext();
  const [treeSelected, setTreeSelected] = useState("");
  const enabled = !!treeSelected && !isControlled && treeSelected !== currentTree.id;

  const { data: workflowData, isError: isErrorWorkflow } = useWorkflowQuery(treeSelected, {
    enabled,
  });

  const {
    data: workflows,
    isLoading: workflowsSuggestionsLoading,
    refetch: fetchWorkflows,
  } = useWorkflowsQuery({
    enabled: !fetchWorkflowsOnOpen,
  });

  const handleChangeTree = useCallback(
    async ({ target }: SelectChangeEvent) => {
      const { value } = target;

      // Reset tree when user select "Add new tree"
      if (value === "add-new-tree") {
        setTreeSelected("");
        setCurrentTree({ name: "" });
        dispatchTree(resetTree());
        return;
      }

      setTreeSelected(value);
      setCurrentTree({ id: value, name: workflows?.find((workflow) => workflow.id === value)?.label });
    },
    [dispatchTree, setCurrentTree, workflows],
  );

  const handleOnOpen = useCallback(async () => {
    if (!fetchWorkflowsOnOpen) {
      return;
    }

    try {
      await fetchWorkflows();

      if (currentTree.id && !treeSelected) {
        setTreeSelected(currentTree.id);
      }
    } catch (error) {
      openSnackbar({ message: t("error.fetchTree", { ns: "snackMessage" }), severity: "error" });
    }
  }, [fetchWorkflowsOnOpen, fetchWorkflows, currentTree.id, treeSelected, openSnackbar, t]);

  // Set current tree when treeSelected is changed
  useEffect(() => {
    if (!workflowData) {
      return;
    }

    if (treeSelected !== currentTree.id) {
      const { id, label, workflow } = workflowData;

      setCurrentTree({ id, name: label });
      dispatchTree(setTree(workflow));
    }
  }, [currentTree.id, dispatchTree, isControlled, setCurrentTree, treeSelected, workflowData]);

  // Display error message when fetch workflow failed
  useEffect(() => {
    if (isErrorWorkflow) {
      openSnackbar({ message: t("error.fetchTree", { ns: "snackMessage" }), severity: "error" });
    }
  }, [isErrorWorkflow, openSnackbar, t]);

  return {
    currentTree,
    fetchWorkflowSuggestions: fetchWorkflows,
    handleChangeTree,
    handleOnOpen,
    setTreeSelected,
    treeSelected,
    workflowsSuggestions: workflows,
    workflowsSuggestionsLoading,
  };
};

export default useTreeSelect;
