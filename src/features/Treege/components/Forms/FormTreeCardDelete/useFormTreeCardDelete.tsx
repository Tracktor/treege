import { FormEvent, useContext } from "react";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";
import { deleteTreeCard } from "@/features/Treege/reducer/treeReducer";

const useFormTreeCardDelete = () => {
  const { dispatchTree, setModalOpen, currentHierarchyPointNode, treePath } = useContext(TreegeContext);

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
