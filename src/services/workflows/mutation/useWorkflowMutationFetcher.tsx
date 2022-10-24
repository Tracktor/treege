import axios from "axios";
import { useContext } from "react";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";
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
  const { version } = useContext(TreegeContext);

  const postWorkflow = (data: WorkflowPostData): Promise<WorkflowPostResponse> =>
    axios.post(`/v1/workflow`, { ...data, version }).then((res) => res.data);

  const patchWorkflow = (data: WorkflowPatchData): Promise<WorkflowPatchResponse> =>
    axios.patch(`/v1/workflow`, { ...data, version }).then((res) => res.data);

  return { patchWorkflow, postWorkflow };
};

export default useWorkflowRequest;
