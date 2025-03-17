import { useMutation } from "@tanstack/react-query";
import { TreeNode } from "@tracktor/types-treege";
import axios from "axios";
import useTreegeContext from "@/hooks/useTreegeContext";

interface PostWorkflowVariables {
  workflow: TreeNode;
  version: string;
  label?: string;
}

interface PostWorkflowResponse {
  workflow_id: string;
}

const usePostWorkflowMutation = () => {
  const { backendConfig } = useTreegeContext();
  const { endpoints } = backendConfig || {};
  const { workflow = "" } = endpoints || {};

  return useMutation({
    mutationFn: async (payload: PostWorkflowVariables) => {
      const { data } = await axios.post<PostWorkflowResponse>(workflow, payload);
      return data;
    },
    mutationKey: ["postWorkflow"],
  });
};

export default usePostWorkflowMutation;
