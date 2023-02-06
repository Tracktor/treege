import type { SelectChangeEvent } from "@tracktor/design-system";
import type { HierarchyPointNode } from "d3-hierarchy";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import fields from "@/constants/fields";
import { appendTreeCard, replaceTreeCard } from "@/features/Treege/reducer/treeReducer";
import type { TreeNode, TreeNodeField, TreeValues } from "@/features/Treege/type/TreeNode";
import useSnackbar from "@/hooks/useSnackbar";
import useTreegeContext from "@/hooks/useTreegeContext";
import useWorkflowQuery from "@/services/workflows/query/useWorkflowQuery";
import { isUniqueArrayItemWithNewEntry } from "@/utils/array";
import getTreeNames from "@/utils/tree/getNodeNames/getNodeNames";
import getTree from "@/utils/tree/getTree/getTree";

const useFormTreeCardMutation = () => {
  const defaultValues = useMemo(() => [{ id: "0", label: "", message: "", value: "" }], []);
  const { tree, dispatchTree, currentHierarchyPointNode, modalOpen, treePath, setModalOpen } = useTreegeContext();
  const { open } = useSnackbar();
  const { t } = useTranslation();
  // Form value
  const [values, setValues] = useState<{ id: string; label: string; value: string; message?: string }[]>(defaultValues);
  const [name, setName] = useState("");
  const [hiddenValue, setHiddenValue] = useState("");
  const [label, setLabel] = useState("");
  const [required, setRequired] = useState(false);
  const [isDecision, setIsDecision] = useState(false);
  const [type, setType] = useState<TreeNodeField["type"]>("text");
  const [treeSelected, setTreeSelected] = useState<string>("");
  const [helperText, setHelperText] = useState("");
  const [step, setStep] = useState("");
  const [messages, setMessages] = useState({ off: "", on: "" });
  const [repeatable, setRepeatable] = useState(false);

  // Form Error
  const [uniqueNameErrorMessage, setUniqueNameErrorMessage] = useState("");
  // State
  const isEditModal = modalOpen === "edit";
  const isTreeField = type === "tree";
  const isHiddenField = type === "hidden";
  const isBooleanField = fields.some((field) => field.type === type && field?.isBooleanField);
  const isDecisionField = fields.some((field) => field.type === type && field?.isDecisionField);
  const isRequiredDisabled = fields.some((field) => field.type === type && field?.isRequiredDisabled);
  const isRepeatableDisabled = fields.some((field) => field.type === type && field?.isRepeatableDisabled);
  const getDisabledValueField = (index: number) => !isDecisionField && index > 0;

  const { refetch: refetchWorkflow, isLoading: isWorkflowLoading } = useWorkflowQuery(treeSelected, {
    enabled: false,
    onError: () => {
      open(t("error.fetchTree", { ns: "snackMessage" }), "error");
    },
  });

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

  const handleChangeHiddenValue = (event: ChangeEvent<HTMLInputElement>) => {
    setHiddenValue(event.target.value);
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

  const handleChangeRepeatable = (event: ChangeEvent<HTMLInputElement>) => {
    setRepeatable(event.target.checked);
  };

  const handleChangeType = (event: SelectChangeEvent<TreeNodeField["type"]>) => {
    setType(event.target.value as TreeNodeField["type"]);

    setIsDecision(false);
    setRequired(false);
    setRepeatable(false);
  };

  const handleChangeTreeSelect = (event: SelectChangeEvent) => {
    setTreeSelected(event.target.value);
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

  const getWorkFlowReq = (isTreeSelected: boolean, isEdit: boolean, isOtherTree: boolean) => {
    // make request if is Tree and not update or isOtherTree selected
    if (isTreeSelected && (!isEdit || isOtherTree)) {
      return refetchWorkflow();
    }

    // don't edit tree
    if (isTreeSelected && isEdit && !isOtherTree) {
      return { data: { workflow: currentHierarchyPointNode?.data.attributes?.tree }, isError: null };
    }

    return { data: null, isError: null };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { on, off } = messages;
    const currentName = currentHierarchyPointNode?.data?.name || "";
    const currentDepth = currentHierarchyPointNode?.depth || 0;
    const isEdit = modalOpen === "edit";
    const depth = currentDepth + (isEdit || currentHierarchyPointNode === null ? 0 : 1);
    const childOfChildren = getChildren(depth);
    const currentPath = treePath?.at(-1)?.path;
    const newPath = treePath.length ? `${currentPath}/${name}` : `/${name}`;
    const isOtherTree = currentHierarchyPointNode?.data.attributes?.tree?.treeId !== treeSelected;

    const { data: workflow, isError } = await getWorkFlowReq(isTreeField, isEdit, isOtherTree);

    if (isError) return;

    const children = {
      attributes: {
        depth,
        label,
        type,
        ...(helperText && { helperText }),
        ...((off || on) && {
          messages: { ...(off && { off }), ...(on && { on }) },
        }),
        ...(isTreeField && { tree: { ...workflow?.workflow, treeId: treeSelected } as TreeNode, treePath: newPath }),
        ...(isDecision && { isDecision }),
        ...(isDecisionField && !isDecision && { values: getTreeValuesWithoutEmptyMessage(values) }),
        ...(required && { required }),
        ...(step && { step }),
        ...(repeatable && { repeatable }),
        ...(isHiddenField && { hiddenValue }),
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
      setTreeSelected(currentHierarchyPointNode?.data.attributes?.tree?.treeId || "");
      setRepeatable(currentHierarchyPointNode?.data.attributes?.repeatable || false);
      setHiddenValue(currentHierarchyPointNode?.data.attributes?.hiddenValue || "");
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
    currentHierarchyPointNode?.data.attributes?.repeatable,
    currentHierarchyPointNode?.data.attributes?.hiddenValue,
    defaultValues,
    modalOpen,
  ]);

  return {
    getDisabledValueField,
    handleAddValue,
    handleChangeHelperText,
    handleChangeHiddenValue,
    handleChangeIsDecisionField,
    handleChangeLabel,
    handleChangeMessage,
    handleChangeName,
    handleChangeOptionLabel,
    handleChangeOptionMessage,
    handleChangeOptionValue,
    handleChangeRepeatable,
    handleChangeRequired,
    handleChangeStep,
    handleChangeTreeSelect,
    handleChangeType,
    handleDeleteValue,
    handleSubmit,
    helperText,
    hiddenValue,
    isBooleanField,
    isDecision,
    isDecisionField,
    isHiddenField,
    isRepeatableDisabled,
    isRequiredDisabled,
    isTreeField,
    isWorkflowLoading,
    label,
    messages,
    name,
    repeatable,
    required,
    step,
    treeSelected,
    type,
    uniqueNameErrorMessage,
    values,
  };
};

export default useFormTreeCardMutation;
