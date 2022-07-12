import { FormEvent, useContext } from "react";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import { deleteTreeCard } from "@/features/DecisionTreeGenerator/reducer/treeReducer";

const useFormTreeCardDelete = () => {
  const { dispatchTree, setModalOpen, currentHierarchyPointNode } = useContext(DecisionTreeGeneratorContext);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    dispatchTree(deleteTreeCard(String(currentHierarchyPointNode?.data.name)));
    setModalOpen(null);
  };

  return {
    handleSubmit,
  };
};

export default useFormTreeCardDelete;
