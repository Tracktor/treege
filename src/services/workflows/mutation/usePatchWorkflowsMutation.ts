import { MutateOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { TreeNode } from "@/features/Treege/type/TreeNode";

interface PatchWorkflowVariables {
  workflow: TreeNode;
  version: string;
  label?: string;
  id?: string;
}

interface PatchWorkflowResponse {
  status: string;
}

const usePatchWorkflowsMutation = (options?: MutateOptions<PatchWorkflowResponse, any, PatchWorkflowVariables>) =>
  useMutation<PatchWorkflowResponse, any, PatchWorkflowVariables>(
    ["patchWorkflow"],
    async (workflow) => {
      const { data } = await axios.patch<PatchWorkflowResponse>(`/v1/workflow`, workflow);
      return data;
    },
    options
  );

export default usePatchWorkflowsMutation;
