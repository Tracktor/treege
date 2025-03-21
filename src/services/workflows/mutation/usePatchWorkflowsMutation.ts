import { useMutation } from "@tanstack/react-query";
import type { TreeNode } from "@tracktor/types-treege";
import axios from "axios";
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

const usePatchWorkflowsMutation = () => {
  const { backendConfig } = useTreegeContext();
  const { endpoints } = backendConfig || {};
  const { workflow = "" } = endpoints || {};

  return useMutation({
    mutationFn: async (payload: PatchWorkflowVariables) => {
      const { data } = await axios.patch<PatchWorkflowResponse>(workflow, payload);
      return data;
    },
    mutationKey: ["patchWorkflow"],
  });
};

export default usePatchWorkflowsMutation;
