import { FormEvent, useContext } from "react";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import { deleteTreeCard } from "@/features/DecisionTreeGenerator/reducer/treeReducer";

const useFormTreeCardDelete = () => {
  const { dispatchTree, setModalOpen, currentHierarchyPointNode, treePath } = useContext(DecisionTreeGeneratorContext);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const currentName = currentHierarchyPointNode?.data?.name || "";
    const currentPath = treePath?.at(-1)?.path || "";

    dispatchTree(deleteTreeCard(currentPath, currentName));

    setModalOpen(null);
  };

  return {
    handleSubmit,
  };
};

export default useFormTreeCardDelete;
