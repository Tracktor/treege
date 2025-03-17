import { useQuery } from "@tanstack/react-query";
import { UseQueryOptions } from "@tanstack/react-query/src/types";
import { TreeNode } from "@tracktor/types-treege";
import axios from "axios";
import useTreegeContext from "@/hooks/useTreegeContext";

interface WorkflowResponse {
  id: string;
  label: string;
  version: string;
  workflow: TreeNode;
}

const useWorkflowQuery = (id?: string, options?: Omit<UseQueryOptions<WorkflowResponse>, "queryFn" | "queryKey">) => {
  const { backendConfig } = useTreegeContext();
  const { endpoints } = backendConfig || {};
  const { workflow = "" } = endpoints || {};

  return useQuery({
    enabled: !!id,
    queryFn: async ({ signal }) => {
      const { data } = await axios.get<WorkflowResponse>(`${workflow}?id=${id}`, { signal });
      return data;
    },
    queryKey: ["workflow", id],
    ...options,
  });
};

export default useWorkflowQuery;
