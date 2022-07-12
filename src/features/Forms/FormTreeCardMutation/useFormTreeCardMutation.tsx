import type { SelectChangeEvent } from "@mui/material/Select";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import { appendTreeCard } from "@/features/DecisionTreeGenerator/reducer/treeReducer";

const useFormTreeCardMutation = () => {
  const { dispatchTree, setModalMutationIsOpen, currentHierarchyPointNode } = useContext(DecisionTreeGeneratorContext);
  const [values, setValues] = useState([{ id: "1", label: "", value: "" }]);
  const [disabled, setDisabled] = useState(false);
  const [name, setName] = useState("");
  const [required, setRequired] = useState(false);
  const [type, setType] = useState("");

  const handleChangeLabel = (event: ChangeEvent<HTMLInputElement>) => {
    setValues((prevState) =>
      [...prevState].map(({ value, label, id }) => {
        if (event.target.dataset.id === id) {
          return { id, label: event.target.value, value };
        }

        return { id, label, value };
      })
    );
  };

  const handleChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    setValues((prevState) =>
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
    const depth = Number(currentHierarchyPointNode?.depth) + 1;

    const children = {
      attributes: {
        depth,
        disabled,
        required,
        type,
      },
      children: values.map(({ value, label }) => ({
        attributes: {
          depth: depth + 1,
          label,
          value,
        },
        children: [],
        name: value,
      })),
      name,
    };

    dispatchTree(appendTreeCard(currentName, children));
    setModalMutationIsOpen(false);
  };

  return {
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
    values,
  };
};

export default useFormTreeCardMutation;
