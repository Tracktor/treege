import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { TreeNode } from "@/features/Treege/type/TreeNode";

export interface WorkflowsResponse {
  id: string;
  label: string;
  version: string;
  workflow: TreeNode;
}

const useWorkflowsQuery = (options?: UseQueryOptions<WorkflowsResponse[]>) =>
  useQuery<WorkflowsResponse[]>(
    ["workflows"],
    async ({ signal }) => {
      const { data } = await axios.get<WorkflowsResponse[]>("/v1/workflows", { signal });

      return data;
    },
    options
  );

export default useWorkflowsQuery;
