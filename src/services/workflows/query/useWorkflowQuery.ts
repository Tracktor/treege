import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { TreeNode } from "@/features/Treege/type/TreeNode";

interface WorkflowResponse {
  id: string;
  label: string;
  version: string;
  workflow: TreeNode;
}

const useWorkflowQuery = (id?: string, options?: UseQueryOptions<WorkflowResponse>) =>
  useQuery<WorkflowResponse>(
    ["/v1/workflow", id],
    async ({ signal }) => {
      const { data } = await axios.get<WorkflowResponse>(`/v1/workflow?id=${id}`, { signal });

      return data;
    },
    {
      enabled: !!id,
      ...options,
    }
  );

export default useWorkflowQuery;
