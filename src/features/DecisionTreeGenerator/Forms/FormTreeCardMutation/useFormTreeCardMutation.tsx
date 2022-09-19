import type { HierarchyPointNode } from "d3-hierarchy";
import type { SelectChangeEvent } from "design-system-tracktor";
import { ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import fields from "@/constants/fields";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import {
  appendTreeCard,
  replaceTreeCard,
  replaceTreeCardAndKeepPrevChildren,
  setIsLeaf,
  setTree,
} from "@/features/DecisionTreeGenerator/reducer/treeReducer";
import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";
import useDebounce from "@/hooks/useDebounce";
import { isUniqueArrayItemWithNewEntry } from "@/utils/array";
import getTreeNames from "@/utils/getTreeNames/getTreeNames";

const useFormTreeCardMutation = () => {
  const defaultValues = useMemo(() => [{ id: "0", label: "", value: "" }], []);
  const { tree, dispatchTree, setModalOpen, currentHierarchyPointNode, modalOpen } = useContext(DecisionTreeGeneratorContext);
  const { t } = useTranslation();

  // Form value
  const [values, setValues] = useState(defaultValues);
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [required, setRequired] = useState(false);
  const [isDecision, setIsDecision] = useState(false);
  const [type, setType] = useState("text");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState("");

  // Form Error
  const [uniqueNameErrorMessage, setUniqueNameErrorMessage] = useState("");

  const debouncedValue = useDebounce(name, 200);
  const isDecisionField = fields.some((field) => field.type === type && field?.isDecisionField);
  const isRequiredDisabled = fields.some((field) => field.type === type && field?.isRequiredDisabled);

  const getDisabledValueField = (index: number) => !isDecisionField && index > 0;

  const handlePresetValues = (event: ChangeEvent<HTMLInputElement>, predicate: "value" | "label") => {
    setValues((prevState) =>
      prevState.map(({ value, label: optionLabel, id }) => {
        if (event.target.dataset.id === id) {
          return {
            id,
            label: predicate === "value" ? optionLabel : event.target.value,
            value: predicate === "value" ? event.target.value : value,
          };
        }

        return { id, label: optionLabel, value };
      })
    );
  };

  const handleChangeLabel = (event: ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value);
  };

  const handleChangeOptionLabel = (event: ChangeEvent<HTMLInputElement>) => {
    handlePresetValues(event, "label");
  };

  const handleChangeOptionValue = (event: ChangeEvent<HTMLInputElement>) => {
    handlePresetValues(event, "value");
  };

  const handleChangeStep = (event: ChangeEvent<HTMLInputElement>) => {
    setStep(event.target.value);
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleChangeRequired = (event: ChangeEvent<HTMLInputElement>) => {
    setRequired(event.target.checked);
  };

  const handleChangeIsDecisionField = (event: ChangeEvent<HTMLInputElement>) => {
    setIsDecision(event.target.checked);
  };

  const handleChangeType = (event: SelectChangeEvent) => {
    setIsDecision(false);
    setRequired(false);
    setType(event.target.value);
  };

  const handleChangeDescription = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
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

  const getNestedChildren = (hierarchyPointNode: null | HierarchyPointNode<TreeNode>, index: number) => {
    const nestedChildren = hierarchyPointNode?.children?.[index]?.data?.children;

    if (!nestedChildren) {
      return [];
    }

    return nestedChildren.map(({ name: childrenName, attributes, children }) => ({
      attributes,
      children,
      name: childrenName,
    }));
  };

  const getChildren = (depth: number) => {
    if (!isDecision) {
      return [];
    }

    return values
      ?.filter((_, index) => !getDisabledValueField(index)) // filter disabled value
      ?.map(({ value, label: optionLabel }, index) => {
        const nextName = `${name}:${value}`;
        const children = getNestedChildren(currentHierarchyPointNode, index);

        return {
          attributes: {
            depth: depth + 1,
            label: optionLabel,
            value,
            ...(children.length === 0 && { isLeaf: true }),
          },
          children,
          name: nextName,
        };
      });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const currentName = currentHierarchyPointNode?.data?.name || "";
    const currentDepth = currentHierarchyPointNode?.depth || 0;
    const isEdit = modalOpen === "edit";
    const depth = currentDepth + (isEdit || currentHierarchyPointNode === null ? 0 : 1);
    const isRoot = !currentHierarchyPointNode || depth === 0;
    const childOfChildren = getChildren(depth);

    const children = {
      attributes: {
        depth,
        description,
        label,
        type,
        ...(isRoot && { isRoot }),
        ...(isDecision && { isDecision }),
        ...(isDecisionField && !isDecision && { values }),
        ...(required && { required }),
        ...(step && { step }),
      },
      children: childOfChildren,
      name,
    };

    if (currentHierarchyPointNode === null) {
      dispatchTree(setTree(children));
    } else if (isEdit) {
      dispatchTree(isDecision ? replaceTreeCard(currentName, children) : replaceTreeCardAndKeepPrevChildren(currentName, children));
    } else {
      dispatchTree(setIsLeaf(currentName, false));
      dispatchTree(appendTreeCard(currentName, children));
    }

    setModalOpen(null);
  };

  // Set initial form data edit modal
  useEffect(() => {
    if (modalOpen === "edit") {
      const currentValues = currentHierarchyPointNode?.data?.attributes?.values;
      const initialValues =
        currentValues ||
        currentHierarchyPointNode?.data?.children
          ?.filter(({ attributes }) => !attributes?.type)
          ?.map(({ attributes }, index) => {
            const { label: optionLabel, value } = attributes || {};
            return { id: String(index), label: String(optionLabel), value: String(value) };
          });

      setName(currentHierarchyPointNode?.data.name || "");
      setType(currentHierarchyPointNode?.data.attributes?.type || "");
      setRequired(currentHierarchyPointNode?.data.attributes?.required || false);
      setStep(currentHierarchyPointNode?.data.attributes?.step || "");
      setLabel(currentHierarchyPointNode?.data.attributes?.label || "");
      setIsDecision(currentHierarchyPointNode?.data.attributes?.isDecision || false);
      setValues(initialValues?.length ? initialValues : defaultValues);
    }
  }, [
    currentHierarchyPointNode?.data.attributes?.isDecision,
    currentHierarchyPointNode?.data.attributes?.label,
    currentHierarchyPointNode?.data.attributes?.required,
    currentHierarchyPointNode?.data.attributes?.step,
    currentHierarchyPointNode?.data.attributes?.type,
    currentHierarchyPointNode?.data.attributes?.values,
    currentHierarchyPointNode?.data?.children,
    currentHierarchyPointNode?.data.name,
    defaultValues,
    modalOpen,
  ]);
  const isEditModal = modalOpen === "edit";

  // Debounce check unique name
  useEffect(() => {
    if (!tree || !debouncedValue) return;

    const excludeNameOnEditModal = isEditModal && currentHierarchyPointNode?.data.name;
    const arrayNames = getTreeNames(tree);
    const isUnique = isUniqueArrayItemWithNewEntry(arrayNames, debouncedValue, excludeNameOnEditModal);

    if (isUnique) {
      setUniqueNameErrorMessage("");
      return;
    }

    setUniqueNameErrorMessage(t("mustBeUnique", { ns: "form" }));
  }, [currentHierarchyPointNode?.data.name, debouncedValue, isEditModal, t, tree]);

  return {
    description,
    getDisabledValueField,
    handleAddValue,
    handleChangeDescription,
    handleChangeIsDecisionField,
    handleChangeLabel,
    handleChangeName,
    handleChangeOptionLabel,
    handleChangeOptionValue,
    handleChangeRequired,
    handleChangeStep,
    handleChangeType,
    handleDeleteValue,
    handleSubmit,
    isDecision,
    isDecisionField,
    isRequiredDisabled,
    label,
    name,
    required,
    step,
    type,
    uniqueNameErrorMessage,
    values,
  };
};

export default useFormTreeCardMutation;
