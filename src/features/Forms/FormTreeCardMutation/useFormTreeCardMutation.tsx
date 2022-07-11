import type { SelectChangeEvent } from "@mui/material/Select";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import { appendTreeCard } from "@/features/DecisionTreeGenerator/reducer/treeReducer";

const useFormTreeCardMutation = () => {
  const { dispatchTree, setModalIsOpen, currentHierarchyPointNode } = useContext(DecisionTreeGeneratorContext);
  const [data, setData] = useState([{ id: "1", label: "", value: "" }]);
  const [disabled, setDisabled] = useState(false);
  const [name, setName] = useState("");
  const [required, setRequired] = useState(false);
  const [type, setType] = useState("");

  const handleChangeLabel = (event: ChangeEvent<HTMLInputElement>) => {
    setData((prevState) =>
      [...prevState].map(({ value, label, id }) => {
        if (event.target.dataset.id === id) {
          return { id, label: event.target.value, value };
        }

        return { id, label, value };
      })
    );
  };

  const handleChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    setData((prevState) =>
      [...prevState].map(({ value, label, id }) => {
        if (event.target.dataset.id === id) {
          return { id, label, value: event.target.value };
        }

        return { id, label, value };
      })
    );
  };

  const handleChangeDisabled = (event: ChangeEvent<HTMLInputElement>) => {
    setDisabled(event.target.checked);
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleChangeRequired = (event: ChangeEvent<HTMLInputElement>) => {
    setRequired(event.target.checked);
  };

  const handleChangeType = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const currentName = String(currentHierarchyPointNode?.data?.name);

    dispatchTree(appendTreeCard(currentName, { attributes: { disabled, required, type }, children: [], name }));
    setModalIsOpen(false);
  };

  return {
    data,
    disabled,
    handleChangeDisabled,
    handleChangeLabel,
    handleChangeName,
    handleChangeRequired,
    handleChangeType,
    handleChangeValue,
    handleSubmit,
    name,
    required,
    type,
  };
};

export default useFormTreeCardMutation;
