import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { TreeNode } from "@/features/Treege/type/TreeNode";
import useTreegeContext from "@/hooks/useTreegeContext";

export interface WorkflowsResponse {
  id: string;
  label: string;
  version: string;
  workflow: TreeNode;
}

const useWorkflowsQuery = (options?: UseQueryOptions<WorkflowsResponse[]>) => {
  const { backendConfig } = useTreegeContext();
  const { endpoints } = backendConfig || {};
  const { workflows = "" } = endpoints || {};

  return useQuery<WorkflowsResponse[]>(
    ["workflows"],
    async ({ signal }) => {
      const { data } = await axios.get<WorkflowsResponse[]>(workflows, { signal });

      return data;
    },
    options,
  );
};

export default useWorkflowsQuery;
