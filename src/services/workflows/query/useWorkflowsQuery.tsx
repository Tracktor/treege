import { useQuery } from "react-query";
import type { TreeNode } from "@/features/Treege/type/TreeNode";
import useWorkflowRequest from "@/services/workflows/useWorkflowRequest";

interface WorkflowsResponse {
  id: string;
  label: string;
  version: string;
  workflow: TreeNode;
}

const useWorkflowsQuery = ({ enabled }: { enabled: boolean }) => {
  const { getAllWorkflow } = useWorkflowRequest();

  return useQuery<WorkflowsResponse[]>("/v1/workflows", getAllWorkflow, { enabled });
};
export default useWorkflowsQuery;
