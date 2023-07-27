import { MutateOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { TreeNode } from "@/features/Treege/type/TreeNode";

interface PostWorkflowVariables {
  workflow: TreeNode;
  version: string;
  label?: string;
}

interface PostWorkflowResponse {
  workflow_id: string;
}

const usePostWorkflowMutation = (options?: MutateOptions<PostWorkflowResponse, any, PostWorkflowVariables>) =>
  useMutation<PostWorkflowResponse, any, PostWorkflowVariables>(
    ["postWorkflow"],
    async (workflow) => {
      const { data } = await axios.post<PostWorkflowResponse>(`/v1/workflow`, workflow);
      return data;
    },
    options
  );

export default usePostWorkflowMutation;
