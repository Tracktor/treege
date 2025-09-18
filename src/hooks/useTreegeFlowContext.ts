import { useContext } from "react";
import { TreegeFlowContext } from "@/features/Treege/context/TreegeFlowProvider";

const useTreegeFlowContext = () => useContext(TreegeFlowContext);

export default useTreegeFlowContext;
