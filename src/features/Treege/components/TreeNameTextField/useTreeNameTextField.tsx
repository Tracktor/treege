import type { ChangeEvent } from "react";
import useTreegeContext from "@/hooks/useTreegeContext";

const useTreeNameTextField = () => {
  const { currentTree, setCurrentTree, tree } = useTreegeContext();
  const { name, errorName, id } = currentTree;
  const disabled = !!currentTree.id && !tree;

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (!value) {
      setCurrentTree((prevState) => ({ ...prevState, errorName: "Champs requis", name: e.target.value }));
      return;
    }

    setCurrentTree((prevState) => ({ ...prevState, errorName: "", name: e.target.value }));
  };

  return { disabled, errorName, handleChangeName, id, name };
};

export default useTreeNameTextField;
