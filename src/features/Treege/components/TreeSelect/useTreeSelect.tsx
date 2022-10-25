import type { SelectChangeEvent } from "design-system-tracktor";
import { useContext, useEffect, useState } from "react";
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
  const currentTreeId = currentTree.id || "";
  const workflowId = treeSelected || currentTreeId;

  const { data: workflow } = useWorkflowQuery(workflowId, {
    enabled: !!workflowId && !isControlled,
    onError: () => open(t("error.fetchTree", { ns: "snackMessage" }), "error"),
    refetchOnWindowFocus: false,
  });

  const {
    data: workflowsSuggestions,
    isLoading: workflowsSuggestionsLoading,
    refetch: refetchWorkflows,
  } = useWorkflowsQuery({
    enabled: false,
    onError: () => {
      open(t("error.fetchTree"), "error");
    },
    refetchOnWindowFocus: false,
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

  useEffect(() => {
    if (workflow) {
      dispatchTree(setTree(workflow.workflow));
      setCurrentTree({ id: workflow.id, name: workflow.label });
    }
  }, [dispatchTree, setCurrentTree, workflow]);

  const fetchWorkflowSuggestions = () => refetchWorkflows();

  return { fetchWorkflowSuggestions, handleChangeTree, setTreeSelected, treeSelected, workflowsSuggestions, workflowsSuggestionsLoading };
};

export default useTreeSelect;
