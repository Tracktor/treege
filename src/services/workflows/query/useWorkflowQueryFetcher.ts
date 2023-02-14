import axios from "axios";
import type { TreeNode } from "@/main";

export interface WorkflowsResponse {
  id: string;
  label: string;
  version: string;
  workflow: TreeNode;
}

const useWorkflowRequest = () => {
  const getAllWorkflow = (): Promise<WorkflowsResponse[]> => axios.get(`/v1/workflows`).then((res) => res.data);

  const getWorkflow = (id: string): Promise<WorkflowsResponse> => axios.get(`/v1/workflow?id=${id}`).then((res) => res.data);

  return { getAllWorkflow, getWorkflow };
};

export default useWorkflowRequest;
