import { FormEvent, useContext } from "react";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import { deleteTreeCard, setIsLeaf } from "@/features/DecisionTreeGenerator/reducer/treeReducer";

const useFormTreeCardDelete = () => {
  const { dispatchTree, setModalOpen, currentHierarchyPointNode } = useContext(DecisionTreeGeneratorContext);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const currentName = currentHierarchyPointNode?.data?.name || "";
    const parentName = currentHierarchyPointNode?.parent?.data.name || "";
    const parentChildren = currentHierarchyPointNode?.parent?.data.children || [];

    if (parentChildren.length === 1) {
      dispatchTree(setIsLeaf(parentName, true));
    }

    dispatchTree(deleteTreeCard(currentName));

    setModalOpen(null);
  };

  return {
    handleSubmit,
  };
};

export default useFormTreeCardDelete;
