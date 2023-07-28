import { MutateOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { TreeNode } from "@/features/Treege/type/TreeNode";
import useTreegeContext from "@/hooks/useTreegeContext";

interface PostWorkflowVariables {
  workflow: TreeNode;
  version: string;
  label?: string;
}

interface PostWorkflowResponse {
  workflow_id: string;
}

const usePostWorkflowMutation = (options?: MutateOptions<PostWorkflowResponse, any, PostWorkflowVariables>) => {
  const { backendConfig } = useTreegeContext();
  const { endpoints } = backendConfig || {};
  const { workflow = "" } = endpoints || {};

  return useMutation<PostWorkflowResponse, any, PostWorkflowVariables>(
    ["postWorkflow"],
    async (payload) => {
      const { data } = await axios.post<PostWorkflowResponse>(workflow, payload);
      return data;
    },
    options
  );
};

export default usePostWorkflowMutation;
