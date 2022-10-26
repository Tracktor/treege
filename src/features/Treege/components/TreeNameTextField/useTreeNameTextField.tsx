import { ChangeEvent, useContext } from "react";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";
import useWorkflowQuery from "@/services/workflows/query/useWorkflowQuery";

const useTreeNameTextField = () => {
  const { currentTree, setCurrentTree } = useContext(TreegeContext);
  const { name, errorName, id } = currentTree;

  useWorkflowQuery(id, {
    enabled: !!id && !name,
    onSuccess: (data) => {
      setCurrentTree({ id: data?.id, name: data?.label });
    },
  });

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (!value) {
      setCurrentTree((prevState) => ({ ...prevState, errorName: "Champs requis", name: e.target.value }));
      return;
    }

    setCurrentTree((prevState) => ({ ...prevState, errorName: "", name: e.target.value }));
  };

  return { errorName, handleChangeName, id, name };
};

export default useTreeNameTextField;
