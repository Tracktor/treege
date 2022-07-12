import type { SelectChangeEvent } from "@mui/material/Select";
import { ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState } from "react";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import { appendTreeCard, replaceTreeCard } from "@/features/DecisionTreeGenerator/reducer/treeReducer";

const useFormTreeCardMutation = () => {
  const defaultValues = useMemo(() => [{ id: "1", label: "", value: "" }], []);
  const { dispatchTree, setModalOpen, currentHierarchyPointNode, modalOpen } = useContext(DecisionTreeGeneratorContext);
  const [values, setValues] = useState(defaultValues);
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
        name: `${label} ${value}`,
      })),
      name,
    };

    modalOpen === "edit" ? dispatchTree(replaceTreeCard(currentName, children)) : dispatchTree(appendTreeCard(currentName, children));
    setModalOpen(null);
  };

  const handleAddValue = () => {
    setValues((prevState) => {
      const nextId = String(Number(prevState[prevState.length - 1]) + 1);
      return [...prevState, { id: nextId, label: "", value: "" }];
    });
  };

  const handleDeleteValue = (idToDelete: string) => {
    console.log(idToDelete);

    setValues((prevState) => prevState.filter(({ id }) => idToDelete === id));
  };

  // Populate form data
  useEffect(() => {
    if (modalOpen === "edit") {
      const initialValues = currentHierarchyPointNode?.data?.children
        ?.filter(({ attributes }) => !attributes?.type)
        ?.map(({ attributes }, index) => {
          const { label, value } = attributes || {};
          return { id: String(index), label: String(label), value: String(value) };
        });

      setName(String(currentHierarchyPointNode?.data.name));
      setType(String(currentHierarchyPointNode?.data.attributes?.type));
      setRequired(Boolean(currentHierarchyPointNode?.data.attributes?.required));
      setDisabled(Boolean(currentHierarchyPointNode?.data.attributes?.disabled));
      setValues(initialValues?.length ? initialValues : defaultValues);
    }
  }, [
    currentHierarchyPointNode,
    currentHierarchyPointNode?.data.attributes?.disabled,
    currentHierarchyPointNode?.data.attributes?.required,
    currentHierarchyPointNode?.data.attributes?.type,
    currentHierarchyPointNode?.data.attributes?.values,
    currentHierarchyPointNode?.data.name,
    defaultValues,
    modalOpen,
  ]);

  return {
    disabled,
    handleAddValue,
    handleChangeDisabled,
    handleChangeLabel,
    handleChangeName,
    handleChangeRequired,
    handleChangeType,
    handleChangeValue,
    handleDeleteValue,
    handleSubmit,
    name,
    required,
    type,
    values,
  };
};

export default useFormTreeCardMutation;
