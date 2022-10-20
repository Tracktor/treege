import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import useSnackbar from "@/hooks/useSnackbar/useSnackbar";
import useWorkflowsQuery from "@/services/workflows/query/useWorkflowsQuery";

const useTreeSelect = () => {
  const { handleOpenSnackbar } = useSnackbar();
  const { t } = useTranslation("snackMessage");

  const {
    data: workflowsSuggestions,
    isLoading: workflowsSuggestionsLoading,
    refetch,
  } = useWorkflowsQuery({
    enabled: false,
    onError: () => {
      handleOpenSnackbar(t("error.fetchTree"), "error");
    },
    refetchOnWindowFocus: false,
  });

  const { refetch: fetchWorkFlow } = useQuery("", (context) => console.log(context.queryKey), {
    enabled: false,
    onError: () => {
      handleOpenSnackbar(t("error.fetchTree"), "error");
    },
    refetchOnWindowFocus: false,
  });

  const fetchWorkflowSuggestions = () => refetch();

  return { fetchWorkFlow, fetchWorkflowSuggestions, workflowsSuggestions, workflowsSuggestionsLoading };
};

export default useTreeSelect;
