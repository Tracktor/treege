import { useContext } from "react";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";
import useApi from "@/hooks/useApi/useApi";
import type { TreeNode } from "@/main";

export interface WorkflowPostData {
  workflow: TreeNode;
  label: string;
}

export interface WorkflowPostResponse {
  workflow_id: string;
}

export interface WorkflowPatchData {
  workflow: TreeNode;
  label: string;
  id: string;
}

export interface WorkflowPatchResponse {
  workflow: TreeNode;
  label: string;
}

const useWorkflowRequest = () => {
  const { api } = useApi();
  const { version } = useContext(TreegeContext);

  const postWorkflow = (data: WorkflowPostData): Promise<WorkflowPostResponse> =>
    api.post(`/v1/workflow`, { ...data, version }).then((res) => res.data);

  const patchWorkflow = (data: WorkflowPatchData): Promise<WorkflowPatchResponse> =>
    api.patch(`/v1/workflow`, { ...data, version }).then((res) => res.data);

  return { patchWorkflow, postWorkflow };
};

export default useWorkflowRequest;
