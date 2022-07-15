import type { SelectChangeEvent } from "@mui/material/Select";
import type { HierarchyPointNode } from "d3-hierarchy";
import { ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState } from "react";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import { appendTreeCard, replaceTreeCard } from "@/features/DecisionTreeGenerator/reducer/treeReducer";
import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

const useFormTreeCardMutation = () => {
  const defaultValues = useMemo(() => [{ id: "0", label: "", value: "" }], []);
  const { dispatchTree, setModalOpen, currentHierarchyPointNode, modalOpen } = useContext(DecisionTreeGeneratorContext);
  const [values, setValues] = useState(defaultValues);
  const [disabled, setDisabled] = useState(false);
  const [name, setName] = useState("");
  const [required, setRequired] = useState(false);
  const [type, setType] = useState("");
  const isMultipleFieldValuesSelected = ["select", "radio"].includes(type);

  const getDisabledValueField = (index: number) => !isMultipleFieldValuesSelected && index > 0;

  const handleChangeLabel = (event: ChangeEvent<HTMLInputElement>) => {
    setValues((prevState) =>
      prevState.map(({ value, label, id }) => {
        if (event.target.dataset.id === id) {
          return { id, label: event.target.value, value };
        }

        return { id, label, value };
      })
    );
  };

  const handleChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    setValues((prevState) =>
      prevState.map(({ value, label, id }) => {
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

  const handleAddValue = () => {
    setValues((prevState) => {
      const lastId = Number(prevState[prevState.length - 1].id);
      const nextId = String(lastId + 1);
      return [...prevState, { id: nextId, label: "", value: "" }];
    });
  };

  const handleDeleteValue = (idToDelete: string) => {
    setValues((prevState) => prevState.filter(({ id }) => idToDelete !== id));
  };

  const getChildrenOfField = (hierarchyPointNode: null | HierarchyPointNode<TreeNode>, index: number) => {
    if (!hierarchyPointNode?.children?.[index]?.data?.children) {
      return [];
    }

    return hierarchyPointNode.children[index].data.children.map(({ name: childrenName, attributes, children }) => ({
      attributes,
      children,
      name: childrenName,
    }));
  };

  const getPaths = (currentPath: string[], prevName: string, nextName: string, isEdit: boolean) => {
    if (!currentPath) {
      return [];
    }

    return [...currentPath, nextName].filter((path) => {
      if (isEdit && prevName !== nextName) {
        return path !== prevName;
      }

      return true;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const prevName = String(currentHierarchyPointNode?.data?.name);
    const prevDepth = Number(currentHierarchyPointNode?.depth);
    const prevPath = currentHierarchyPointNode?.data?.attributes?.paths || [];
    const isEdit = modalOpen === "edit";
    const depth = prevDepth + (isEdit ? 0 : 1);
    const paths = getPaths(prevPath, prevName, name, isEdit);

    const children = {
      attributes: {
        depth,
        disabled,
        ...(prevDepth === 0 && { isRoot: true }),
        paths,
        required,
        type,
      },
      children: values
        ?.filter((_, index) => !getDisabledValueField(index)) // filter disabled value
        ?.map(({ value, label }, index) => ({
          attributes: {
            depth: depth + 1,
            label,
            paths: [...paths, `${label} ${value}`],
            value,
          },
          children: getChildrenOfField(currentHierarchyPointNode, index),
          name: `${label} ${value}`,
        })),
      name,
    };

    dispatchTree(isEdit ? replaceTreeCard(prevName, children) : appendTreeCard(prevName, children));
    setModalOpen(null);
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
    currentHierarchyPointNode?.data.attributes?.value,
    currentHierarchyPointNode?.data.name,
    defaultValues,
    modalOpen,
  ]);

  return {
    disabled,
    getDisabledValueField,
    handleAddValue,
    handleChangeDisabled,
    handleChangeLabel,
    handleChangeName,
    handleChangeRequired,
    handleChangeType,
    handleChangeValue,
    handleDeleteValue,
    handleSubmit,
    isMultipleFieldValuesSelected,
    name,
    required,
    type,
    values,
  };
};

export default useFormTreeCardMutation;
