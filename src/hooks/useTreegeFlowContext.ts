import { useContext } from "react";
import { TreegeFlowContext } from "@/context/TreegeFlow/TreegeFlow.context";

const useTreegeFlowContext = () => useContext(TreegeFlowContext);

export default useTreegeFlowContext;
