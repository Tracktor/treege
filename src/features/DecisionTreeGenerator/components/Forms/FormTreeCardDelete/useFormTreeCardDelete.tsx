import { FormEvent, useContext } from "react";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import { deleteTreeCard, setIsLeaf } from "@/features/DecisionTreeGenerator/reducer/treeReducer";

const useFormTreeCardDelete = () => {
  const { dispatchTree, setModalOpen, currentHierarchyPointNode, tree, treePath } = useContext(DecisionTreeGeneratorContext);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const currentName = currentHierarchyPointNode?.data?.name || "";
    const parentName = currentHierarchyPointNode?.parent?.data.name || "";
    const parentChildren = currentHierarchyPointNode?.parent?.data.children || [];
    const currentPath = treePath?.at(-1)?.path || "";

    if (parentChildren.length === 1) {
      dispatchTree(setIsLeaf(parentName, true));
    }

    dispatchTree(deleteTreeCard(tree, currentPath, currentName));

    setModalOpen(null);
  };

  return {
    handleSubmit,
  };
};

export default useFormTreeCardDelete;
