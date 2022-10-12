import type { HierarchyPointNode } from "d3-hierarchy";
import type { SelectChangeEvent } from "design-system-tracktor";
import { ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import fields from "@/constants/fields";
import TreeData from "@/constants/TreeData";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";
import { appendTreeCard, replaceTreeCard } from "@/features/Treege/reducer/treeReducer";
import type { TreeNode, TreeNodeField, TreeValues } from "@/features/Treege/type/TreeNode";
import { isUniqueArrayItemWithNewEntry } from "@/utils/array";
import getTreeNames from "@/utils/tree/getNodeNames/getNodeNames";
import getTree from "@/utils/tree/getTree/getTree";

const useFormTreeCardMutation = () => {
  const defaultValues = useMemo(() => [{ id: "0", label: "", message: "", value: "" }], []);
  const { tree, dispatchTree, currentHierarchyPointNode, modalOpen, treePath, setModalOpen } = useContext(TreegeContext);
  const { t } = useTranslation();

  // Form value
  const [values, setValues] = useState<{ id: string; label: string; value: string; message?: string }[]>(defaultValues);
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [required, setRequired] = useState(false);
  const [isDecision, setIsDecision] = useState(false);
  const [type, setType] = useState<TreeNodeField["type"]>("text");
  const [treeSelect, setTreeSelect] = useState<string>("");
  const [helperText, setHelperText] = useState("");
  const [step, setStep] = useState("");
  const [messages, setMessages] = useState({ off: "", on: "" });

  // Form Error
  const [uniqueNameErrorMessage, setUniqueNameErrorMessage] = useState("");

  const isEditModal = modalOpen === "edit";
  const isTree = type === "tree";
  const isBooleanField = fields.some((field) => field.type === type && field?.isBooleanField);
  const isDecisionField = fields.some((field) => field.type === type && field?.isDecisionField);
  const isRequiredDisabled = fields.some((field) => field.type === type && field?.isRequiredDisabled);
  const getDisabledValueField = (index: number) => !isDecisionField && index > 0;

  const handlePresetValues = (event: ChangeEvent<HTMLInputElement>, predicate: "value" | "label" | "message") => {
    setValues((prevState) =>
      prevState.map((item) => {
        const { id } = item;
        if (event.target.dataset.id === id) {
          return {
            ...item,
            id,
            [predicate]: event.target.value,
          };
        }

        return { ...item };
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
    const { value } = event.target;

    setName(event.target.value);

    if (!tree || !value) {
      setUniqueNameErrorMessage("");
      return;
    }

    const excludeNameOnEditModal = isEditModal && currentHierarchyPointNode?.data.name;
    const currentTreePath = treePath?.at(-1)?.path;
    const currentTree = getTree(tree, currentTreePath);
    const arrayNames = getTreeNames(currentTree);
    const isUnique = isUniqueArrayItemWithNewEntry(arrayNames, value, excludeNameOnEditModal);

    if (isUnique) {
      setUniqueNameErrorMessage("");
      return;
    }

    setUniqueNameErrorMessage(t("mustBeUnique", { ns: "form" }));
  };

  const handleChangeRequired = (event: ChangeEvent<HTMLInputElement>) => {
    setRequired(event.target.checked);
  };

  const handleChangeIsDecisionField = (event: ChangeEvent<HTMLInputElement>) => {
    setIsDecision(event.target.checked);
  };

  const handleChangeType = (event: SelectChangeEvent<TreeNodeField["type"]>) => {
    setType(event.target.value as TreeNodeField["type"]);
  };

  const handleChangeTreeSelect = (event: SelectChangeEvent<string>) => {
    setTreeSelect(event.target.value);
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
      return [...prevState, { ...defaultValues[0], id: nextId }];
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

  const getTreeValuesWithoutEmptyMessage = (valuesData: TreeValues[]) =>
    valuesData.map(({ message, ...rest }) => ({ ...rest, ...(message && { message }) }));

  const getTreeById = (id: string) => TreeData?.find(({ id: treeId }) => treeId === id);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const { on, off } = messages;
    const currentName = currentHierarchyPointNode?.data?.name || "";
    const currentDepth = currentHierarchyPointNode?.depth || 0;
    const isEdit = modalOpen === "edit";
    const depth = currentDepth + (isEdit || currentHierarchyPointNode === null ? 0 : 1);
    const childOfChildren = getChildren(depth);
    const currentPath = treePath?.at(-1)?.path;
    const newPath = treePath.length ? `${currentPath}/${name}` : `/${name}`;

    const children = {
      attributes: {
        depth,
        label,
        type,
        ...(helperText && { helperText }),
        ...((off || on) && {
          messages: { ...(off && { off }), ...(on && { on }) },
        }),
        ...(isTree && { tree: { ...getTreeById(treeSelect)?.value, treeId: treeSelect } as TreeNode, treePath: newPath }),
        ...(isDecision && { isDecision }),
        ...(isDecisionField && !isDecision && { values: getTreeValuesWithoutEmptyMessage(values) }),
        ...(required && { required }),
        ...(step && { step }),
      },
      children: childOfChildren,
      name,
    };

    if (isEdit) {
      dispatchTree(replaceTreeCard(currentPath || "", currentName, children));
    } else {
      dispatchTree(appendTreeCard(currentPath || null, currentName, children));
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
              value: String(value),
              ...(message && { message: String(message) }),
            };
          });

      setName(currentHierarchyPointNode?.data.name || "");
      setType(currentHierarchyPointNode?.data.attributes?.type || "text");
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
      setTreeSelect(currentHierarchyPointNode?.data.attributes?.tree?.treeId || "");
    }
  }, [
    currentHierarchyPointNode?.data.attributes?.tree?.treeId,
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
    handleChangeTreeSelect,
    handleChangeType,
    handleDeleteValue,
    handleSubmit,
    helperText,
    isBooleanField,
    isDecision,
    isDecisionField,
    isRequiredDisabled,
    isTree,
    label,
    messages,
    name,
    required,
    step,
    treeSelect,
    type,
    uniqueNameErrorMessage,
    values,
  };
};

export default useFormTreeCardMutation;