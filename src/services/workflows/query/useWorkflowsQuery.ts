import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import type { TreeNode } from "@tracktor/types-treege";
import axios from "axios";
import useTreegeContext from "@/hooks/useTreegeContext";

export interface WorkflowsResponse {
  id: string;
  label: string;
  version: string;
  workflow: TreeNode;
}

const useWorkflowsQuery = (options?: Omit<UseQueryOptions<WorkflowsResponse[]>, "queryFn" | "queryKey">) => {
  const { backendConfig } = useTreegeContext();
  const { endpoints } = backendConfig || {};
  const { workflows = "" } = endpoints || {};

  return useQuery({
    queryFn: async ({ signal }) => {
      const { data } = await axios.get<WorkflowsResponse[]>(workflows, { signal });
      return data;
    },
    queryKey: ["workflows"],
    ...options,
  });
};

export default useWorkflowsQuery;
