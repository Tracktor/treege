import { useQuery } from "react-query";
import useSnackbar from "@/hooks/useSnackbar/useSnackbar";
import useWorkflowQueryFetcher from "@/services/workflows/query/useWorkflowQueryFetcher";
// { enabled }: { enabled?: boolean }

const useWorkflowsQuery = () => {
  const { getAllWorkflow } = useWorkflowQueryFetcher();
  const { handleOpenSnackbar } = useSnackbar();

  return useQuery("/v1/workflows", getAllWorkflow, {
    enabled: false,
    onError: () => {
      handleOpenSnackbar("Error", "error");
    },
    refetchOnWindowFocus: false,
  });
};
export default useWorkflowsQuery;
