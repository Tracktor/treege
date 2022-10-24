import { useTranslation } from "react-i18next";
import useSnackbar from "@/hooks/useSnackbar/useSnackbar";
import useWorkflowsQuery from "@/services/workflows/query/useWorkflowsQuery";

const useTreeSelect = () => {
  const { open } = useSnackbar();
  const { t } = useTranslation("snackMessage");

  const {
    data: workflowsSuggestions,
    isLoading: workflowsSuggestionsLoading,
    refetch,
  } = useWorkflowsQuery({
    enabled: false,
    onError: () => {
      open(t("error.fetchTree"), "error");
    },
    refetchOnWindowFocus: false,
  });

  const fetchWorkflowSuggestions = () => refetch();

  return { fetchWorkflowSuggestions, workflowsSuggestions, workflowsSuggestionsLoading };
};

export default useTreeSelect;
