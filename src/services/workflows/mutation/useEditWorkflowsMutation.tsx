import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import useWorkflowMutationFetcher, {
  WorkflowPatchData,
  WorkflowPatchResponse,
} from "@/services/workflows/mutation/useWorkflowMutationFetcher";

interface Options extends UseMutationOptions<WorkflowPatchResponse, any, WorkflowPatchData, UseMutationOptions> {}

const useEditWorkflowsMutation = (options: Options) => {
  const { patchWorkflow } = useWorkflowMutationFetcher();

  return useMutation(patchWorkflow, options);
};
export default useEditWorkflowsMutation;
