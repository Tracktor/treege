import type { FormEvent } from "react";
import { deleteTreeCard } from "@/features/TreegeTree/reducer/treeReducer";
import useTreegeContext from "@/hooks/useTreegeContext";

const useFormTreeCardDelete = () => {
  const { dispatchTree, setModalOpen, currentHierarchyPointNode, treePath } = useTreegeContext();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const currentName = currentHierarchyPointNode?.data?.uuid || "";
    const currentPath = treePath?.at(-1)?.path || "";

    dispatchTree(deleteTreeCard(currentPath, currentName));

    setModalOpen(null);
  };

  return {
    handleSubmit,
  };
};

export default useFormTreeCardDelete;
