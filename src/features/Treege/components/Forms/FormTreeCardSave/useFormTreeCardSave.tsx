import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";
import useAddWorkflowsMutation from "@/services/workflows/mutation/useAddWorkflowsMutation";

const useFormTreeCardSave = () => {
  const { setModalOpen, tree } = useContext(TreegeContext);
  const { mutate } = useAddWorkflowsMutation(() => setModalOpen(null));
  const [label, setLabel] = useState("");

  const handleChangeLabel = (event: ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (tree) {
      mutate({ label, workflow: tree });
    }
  };

  return {
    handleChangeLabel,
    handleSubmit,
    label,
  };
};

export default useFormTreeCardSave;
