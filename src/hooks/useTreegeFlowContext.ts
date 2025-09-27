import { useContext } from "react";
import { TreegeFlowContext } from "@/context/TreegeFlow/TreegeFlowContext";

const useTreegeFlowContext = () => useContext(TreegeFlowContext);

export default useTreegeFlowContext;
