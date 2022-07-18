import { useContext } from "react";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";

const useButtonCreateTree = () => {
  const { setModalOpen } = useContext(DecisionTreeGeneratorContext);

  const handleClick = () => setModalOpen("add");

  return { handleClick };
};

export default useButtonCreateTree;
