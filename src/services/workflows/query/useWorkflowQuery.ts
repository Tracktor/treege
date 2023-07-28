import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { TreeNode } from "@/features/Treege/type/TreeNode";
import useTreegeContext from "@/hooks/useTreegeContext";

interface WorkflowResponse {
  id: string;
  label: string;
  version: string;
  workflow: TreeNode;
}

const useWorkflowQuery = (id?: string, options?: UseQueryOptions<WorkflowResponse>) => {
  const { backendConfig } = useTreegeContext();
  const { endpoints } = backendConfig || {};
  const { workflow = "" } = endpoints || {};

  return useQuery<WorkflowResponse>(
    ["workflow", id],
    async ({ signal }) => {
      const { data } = await axios.get<WorkflowResponse>(`${workflow}?id=${id}`, { signal });

      return data;
    },
    {
      enabled: !!id,
      ...options,
    }
  );
};

export default useWorkflowQuery;
