import { FormEvent, useContext } from "react";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import { deleteTreeCard } from "@/features/DecisionTreeGenerator/reducer/treeReducer";

const useFormTreeCardDelete = () => {
  const { dispatchTree, setModalDeleteIsOpen, currentHierarchyPointNode } = useContext(DecisionTreeGeneratorContext);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    dispatchTree(deleteTreeCard(String(currentHierarchyPointNode?.data.name)));
    setModalDeleteIsOpen(false);
  };

  return {
    handleSubmit,
  };
};

export default useFormTreeCardDelete;
