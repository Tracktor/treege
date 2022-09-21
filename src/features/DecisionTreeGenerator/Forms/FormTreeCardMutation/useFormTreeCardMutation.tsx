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
  const [values, setValues] = useState<{ id: string; label: string; value: string; message?: string }[]>(defaultValues);
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [required, setRequired] = useState(false);
  const [isDecision, setIsDecision] = useState(false);
  const [type, setType] = useState("text");
  const [helperText, setHelperText] = useState("");
  const [step, setStep] = useState("");
  const [messages, setMessages] = useState({ off: "", on: "" });

  // Form Error
  const [uniqueNameErrorMessage, setUniqueNameErrorMessage] = useState("");

  const debouncedValue = useDebounce(name, 200);
  const isEditModal = modalOpen === "edit";
  const isBooleanField = ["switch", "checkbox"].includes(type);
  const isDecisionField = fields.some((field) => field.type === type && field?.isDecisionField);
  const isRequiredDisabled = fields.some((field) => field.type === type && field?.isRequiredDisabled);
  const getDisabledValueField = (index: number) => !isDecisionField && index > 0;

  const handlePresetValues = (event: ChangeEvent<HTMLInputElement>, predicate: "value" | "label" | "message") => {
    setValues((prevState) =>
      prevState.map(({ value, label: optionLabel, id, message }) => {
        if (event.target.dataset.id === id) {
          return {
            id,
            label: predicate === "label" ? event.target.value : optionLabel,
            message: predicate === "message" ? event.target.value : message,
            value: predicate === "value" ? event.target.value : value,
          };
        }

        return { id, label: optionLabel, message, value };
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

  const handleChangeOptionMessage = (event: ChangeEvent<HTMLInputElement>) => {
    handlePresetValues(event, "message");
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

  const handleChangeMessage = (nameMessage: "on" | "off") => (event: ChangeEvent<HTMLInputElement>) => {
    setMessages((currentState) => ({ ...currentState, [nameMessage]: event.target.value }));
  };

  const handleChangeHelperText = (event: ChangeEvent<HTMLInputElement>) => {
    setHelperText(event.target.value);
  };

  const handleAddValue = () => {
    setValues((prevState) => {
      const lastId = Number(prevState[prevState.length - 1].id);
      const nextId = String(lastId + 1);
      return [...prevState, { id: nextId, label: "", message: "", value: "" }];
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
      ?.map(({ message, value, label: optionLabel }, index) => {
        const nextName = `${name}:${value}`;
        const children = getNestedChildren(currentHierarchyPointNode, index);

        return {
          attributes: {
            depth: depth + 1,
            label: optionLabel,
            value,
            ...(message && { message }),
            ...(children.length === 0 && { isLeaf: true }),
          },
          children,
          name: nextName,
        };
      });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const { on, off } = messages;
    const currentName = currentHierarchyPointNode?.data?.name || "";
    const currentDepth = currentHierarchyPointNode?.depth || 0;
    const isEdit = modalOpen === "edit";
    const depth = currentDepth + (isEdit || currentHierarchyPointNode === null ? 0 : 1);
    const isRoot = !currentHierarchyPointNode || depth === 0;
    const childOfChildren = getChildren(depth);

    const cleanValues =
      isDecisionField &&
      !isDecision &&
      values?.reduce<{ id: string; label: string; value: string; message?: string }[]>(
        (acc, { message, ...rest }) => [...acc, { ...rest, ...(message && { message }) }],
        []
      );

    const children = {
      attributes: {
        depth,
        label,
        type,
        ...(helperText && { helperText }),
        ...((off || on) && {
          messages: { ...(off && { off }), ...(on && { on }) },
        }),
        ...(isRoot && { isRoot }),
        ...(isDecision && { isDecision }),
        ...(isDecisionField && !isDecision && cleanValues && { values: cleanValues }),
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
            const { label: optionLabel, value, message } = attributes || {};

            return {
              id: String(index),
              label: String(optionLabel),
              ...(message && { message: String(message) }),
              value: String(value),
            };
          });

      setName(currentHierarchyPointNode?.data.name || "");
      setType(currentHierarchyPointNode?.data.attributes?.type || "");
      setHelperText(currentHierarchyPointNode?.data.attributes?.helperText || "");
      setRequired(currentHierarchyPointNode?.data.attributes?.required || false);
      setStep(currentHierarchyPointNode?.data.attributes?.step || "");
      setLabel(currentHierarchyPointNode?.data.attributes?.label || "");
      setIsDecision(currentHierarchyPointNode?.data.attributes?.isDecision || false);
      setValues(initialValues?.length ? initialValues : defaultValues);
      setMessages({
        off: currentHierarchyPointNode?.data.attributes?.messages?.off || "",
        on: currentHierarchyPointNode?.data.attributes?.messages?.on || "",
      });
    }
  }, [
    currentHierarchyPointNode?.data.attributes?.messages,
    currentHierarchyPointNode?.data.attributes?.helperText,
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
    getDisabledValueField,
    handleAddValue,
    handleChangeHelperText,
    handleChangeIsDecisionField,
    handleChangeLabel,
    handleChangeMessage,
    handleChangeName,
    handleChangeOptionLabel,
    handleChangeOptionMessage,
    handleChangeOptionValue,
    handleChangeRequired,
    handleChangeStep,
    handleChangeType,
    handleDeleteValue,
    handleSubmit,
    helperText,
    isBooleanField,
    isDecision,
    isDecisionField,
    isRequiredDisabled,
    label,
    messages,
    name,
    required,
    step,
    type,
    uniqueNameErrorMessage,
    values,
  };
};

export default useFormTreeCardMutation;
