import { useQuery } from "react-query";
import useSnackbar from "@/hooks/useSnackbar/useSnackbar";
import useWorkflowQueryFetcher from "@/services/workflows/query/useWorkflowQueryFetcher";
// { enabled }: { enabled?: boolean }

const useWorkflowQuery = (id: string) => {
  const { getWorkflow } = useWorkflowQueryFetcher();
  const { handleOpenSnackbar } = useSnackbar();

  return useQuery("/v1/workflow", () => getWorkflow(id), {
    enabled: false,
    // disable this query from automatically running
    onError: () => {
      handleOpenSnackbar("Error", "error");
    },
    refetchOnWindowFocus: false,
  });
};

export default useWorkflowQuery;
