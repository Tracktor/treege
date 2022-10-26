import { useQuery, UseQueryOptions } from "react-query";
import useWorkflowQueryFetcher, { WorkflowsResponse } from "@/services/workflows/query/useWorkflowQueryFetcher";

interface Options extends Omit<UseQueryOptions<any, any, WorkflowsResponse, any>, "queryKey" | "queryFn"> {}

const useWorkflowQuery = (id?: string, options?: Options) => {
  const { getWorkflow } = useWorkflowQueryFetcher();

  return useQuery(["/v1/workflow", id], () => id && getWorkflow(id), {
    refetchOnWindowFocus: false,
    ...options,
  });
};

export default useWorkflowQuery;
