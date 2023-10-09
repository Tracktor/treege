import { MutateOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { TreeNode } from "@/features/Treege/type/TreeNode";
import useTreegeContext from "@/hooks/useTreegeContext";

interface PatchWorkflowVariables {
  workflow: TreeNode;
  version: string;
  label?: string;
  id?: string;
}

interface PatchWorkflowResponse {
  status: string;
}

const usePatchWorkflowsMutation = (options?: MutateOptions<PatchWorkflowResponse, any, PatchWorkflowVariables>) => {
  const { backendConfig } = useTreegeContext();
  const { endpoints } = backendConfig || {};
  const { workflow = "" } = endpoints || {};

  return useMutation<PatchWorkflowResponse, any, PatchWorkflowVariables>(
    ["patchWorkflow"],
    async (payload) => {
      const { data } = await axios.patch<PatchWorkflowResponse>(workflow, payload);
      return data;
    },
    options,
  );
};

export default usePatchWorkflowsMutation;
