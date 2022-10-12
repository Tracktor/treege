import { useContext } from "react";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";

const useButtonCreateTree = () => {
  const { setModalOpen } = useContext(TreegeContext);

  const handleClick = () => setModalOpen("add");

  return { handleClick };
};

export default useButtonCreateTree;
