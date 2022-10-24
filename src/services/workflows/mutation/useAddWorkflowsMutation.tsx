import { useMutation, UseMutationOptions } from "react-query";
import useWorkflowMutationFetcher, {
  WorkflowPostData,
  WorkflowPostResponse,
} from "@/services/workflows/mutation/useWorkflowMutationFetcher";

interface Options extends UseMutationOptions<WorkflowPostResponse, any, WorkflowPostData, UseMutationOptions> {}

const useAddWorkflowsMutation = (options: Options) => {
  const { postWorkflow } = useWorkflowMutationFetcher();

  return useMutation(postWorkflow, options);
};
export default useAddWorkflowsMutation;
