import { useContext } from "react";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";

const useTreegeContext = () => useContext(TreegeContext);

export default useTreegeContext;
