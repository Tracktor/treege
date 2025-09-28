import { useContext } from "react";
import { TreegeFlowContext } from "@/context/TreegeFlow/TreegeFlowContext";

const useTreegeFlowContext = () => {
  if (!TreegeFlowContext) {
    throw new Error("useTreegeFlowContext must be used within a TreegeFlowProvider");
  }

  return useContext(TreegeFlowContext);
};

export default useTreegeFlowContext;
