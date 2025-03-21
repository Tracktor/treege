import { useContext } from "react";
import { TreegeContext } from "@/features/Treege/context/TreegeProvider";

const useTreegeContext = () => {
  if (!TreegeContext) {
    throw new Error("useTreegeContext must be used within a TreegeProvider");
  }

  return useContext(TreegeContext);
};

export default useTreegeContext;
