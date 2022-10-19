import useApi from "@/hooks/useApi/useApi";
import type { TreeNode } from "@/main";

interface WorkflowPostData {
  workflow: TreeNode;
  label: string;
}

interface WorkflowPostResponse {
  workflow_id: string;
}

const useWorkflowRequest = () => {
  const { api } = useApi();

  const postWorkflow = (data: WorkflowPostData): Promise<WorkflowPostResponse> =>
    api.post(`/v1/workflow`, { ...data, version: "1" }).then((res) => res.data);

  return { postWorkflow };
};

export default useWorkflowRequest;
