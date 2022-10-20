import { useQuery, UseQueryOptions } from "react-query";
import useWorkflowQueryFetcher, { WorkflowsResponse } from "@/services/workflows/query/useWorkflowQueryFetcher";

interface Options extends Omit<UseQueryOptions<any, any, WorkflowsResponse[], any>, "queryKey" | "queryFn"> {}

const useWorkflowsQuery = (options: Options) => {
  const { getAllWorkflow } = useWorkflowQueryFetcher();

  return useQuery("/v1/workflows", getAllWorkflow, options);
};
export default useWorkflowsQuery;
