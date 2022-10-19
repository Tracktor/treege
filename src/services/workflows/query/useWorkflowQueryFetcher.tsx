import useApi from "@/hooks/useApi/useApi";
import type { TreeNode } from "@/main";

interface WorkflowsResponse {
  id: string;
  label: string;
  version: string;
  workflow: TreeNode;
}

const useWorkflowRequest = () => {
  const { api } = useApi();

  const getAllWorkflow = (): Promise<WorkflowsResponse[] | []> => api.get(`/v1/workflows`).then((res) => res.data);

  const getWorkflow = (id: string): Promise<WorkflowsResponse> => api.get(`/v1/workflow?id=${id}`).then((res) => res.data);

  return { getAllWorkflow, getWorkflow };
};

export default useWorkflowRequest;
