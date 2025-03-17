import type { SelectChangeEvent } from "@tracktor/design-system";
import type { HierarchyPointNode } from "d3-hierarchy";
import { ChangeEvent, FormEvent, MouseEvent, SyntheticEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import fields from "@/constants/fields";
import { appendTreeCard, replaceTreeCard } from "@/features/Treege/reducer/treeReducer";
import type { Params, Route, TreeNode, TreeNodeField, TreeValues } from "@/features/Treege/type/TreeNode";
import useSnackbar from "@/hooks/useSnackbar";
import useTreegeContext from "@/hooks/useTreegeContext";
import useWorkflowQuery from "@/services/workflows/query/useWorkflowQuery";
import { getUUID } from "@/utils";

interface Values {
  id: string;
  label: string;
  value: string;
  message?: string;
}

const useFormTreeCardMutation = () => {
  const uuid = getUUID();
  const defaultValues = useMemo(() => [{ id: "0", label: "", message: "", value: "" }], []);
  const { dispatchTree, currentHierarchyPointNode, modalOpen, treePath, setModalOpen } = useTreegeContext();
  const { open } = useSnackbar();
  const { t } = useTranslation();
  const isMultipleAttribute =
    currentHierarchyPointNode?.data &&
    currentHierarchyPointNode?.data?.attributes &&
    "isMultiple" in currentHierarchyPointNode.data.attributes
      ? Boolean(currentHierarchyPointNode.data.attributes.isMultiple)
      : null;

  // Form value
  const [values, setValues] = useState<Values[]>(defaultValues);
  const [hiddenValue, setHiddenValue] = useState("");
  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [isDisabledPast, setIsDisabledPast] = useState(false);
  const [required, setRequired] = useState(false);
  const [isDecision, setIsDecision] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);
  const [type, setType] = useState<TreeNodeField["type"]>("text");
  const [tag, setTag] = useState<string | null>(null);
  const [parentRef, setParentRef] = useState<string | null>(null);
  const [route, setRoute] = useState<Route>({ url: "" });
  const [treeSelected, setTreeSelected] = useState<string>("");
  const [helperText, setHelperText] = useState("");
  const [messages, setMessages] = useState({ off: "", on: "" });
  const [repeatable, setRepeatable] = useState(false);
  const [initialQuery, setInitialQuery] = useState(false);
  const [pattern, setPattern] = useState("");
  const [patternMessage, setPatternMessage] = useState("");

  // State
  const isEditModal = modalOpen === "edit";
  const isTreeField = type === "tree";
  const isHiddenField = type === "hidden";
  const isAutocomplete = type === "autocomplete";
  const isDateRangePicker = type === "dateRange";
  const isDynamicSelect = type === "dynamicSelect";
  const isBooleanField = fields.some((field) => field.type === type && field?.isBooleanField);
  const isDecisionField = fields.some((field) => field.type === type && field?.isDecisionField);
  const isRequiredDisabled = fields.some((field) => field.type === type && field?.isRequiredDisabled);
  const isRepeatableDisabled = fields.some((field) => field.type === type && field?.isRepeatableDisabled);
  const isLeaf = currentHierarchyPointNode?.data?.attributes?.isLeaf ?? true;
  const isMultiplePossible = fields.some((field) => field.type === type && "isMultiple" in field);
  const { refetch: fetchWorkflow, isLoading: isWorkflowLoading } = useWorkflowQuery(treeSelected, { enabled: false });
  const getDisabledValueField = useCallback((index: number) => !isDecisionField && index > 0, [isDecisionField]);

  const handlePresetValues = useCallback(
    (predicate: "value" | "label" | "message") => (event: ChangeEvent<HTMLInputElement>) => {
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
        }),
      );
    },
    [],
  );

  const handleChangeTag = useCallback(
    (_: SyntheticEvent<Element, Event>, newValue: string | { inputValue: string; label: string } | null) => {
      if (typeof newValue === "string") {
        setTag(newValue);
      } else if (newValue && newValue.inputValue) {
        setTag(newValue.inputValue);
      } else {
        setTag(null);
      }
    },
    [],
  );

  const handleChangeParentRef = useCallback((_: SelectChangeEvent<string | undefined>, newValue: string | undefined) => {
    setRoute((prevState) => ({
      ...prevState,
      url: prevState.url ? prevState.url.replace(/{{[^{}]+}}/, `{{${newValue || ""}}}`) : `https://example.com/{{${newValue || ""}}}`,
    }));
    setParentRef(newValue ?? null);
  }, []);

  const handleChangeHiddenValue = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    setHiddenValue(target.value);
  }, []);

  const handleChangeLabel = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    setLabel(target.value);
  }, []);

  const handleChangeName = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    setName(target.value);
  }, []);

  const handleChangeUrl = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    setRoute((prevState) => ({ ...prevState, url: target.value }));
  }, []);

  const handleChangeUrlSelect = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      const newValue = target.value;
      if (newValue.includes("{{}}")) {
        const addParentInBracket = newValue.replace("{{}}", `{{${parentRef || ""}}}`);
        setRoute((prevState) => ({ ...prevState, url: addParentInBracket }));
      } else if (newValue.includes("{{")) {
        const replaceTextWithParentRef = newValue.replace(/{{[^{}]+}}/, `{{${parentRef || ""}}}`);
        setRoute((prevState) => ({
          ...prevState,
          url: replaceTextWithParentRef,
        }));
      } else {
        setRoute((prevState) => ({ ...prevState, url: newValue }));
      }
    },
    [parentRef],
  );

  const handleChangeSearchKey = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    setRoute((prevState) => ({
      ...prevState,
      searchKey: target.value,
    }));
  }, []);

  const handleChangePath = useCallback(
    <T extends HTMLInputElement | HTMLTextAreaElement>(property: string, event: ChangeEvent<T>) => {
      setRoute((prevState) => {
        const updatedPathKey = {
          ...prevState.pathKey,
          [property]: event.target.value,
        };
        if (event.target.value === "" && property in updatedPathKey) {
          const { pathKey, ...nextState } = prevState;
          return {
            ...nextState,
          };
        }
        return {
          ...prevState,
          pathKey: updatedPathKey,
        };
      });
    },
    [setRoute],
  );

  const handleChangeParam = useCallback(
    (index: number, property: keyof Params, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRoute((prevState) => {
        const updatedParams = [...(prevState.params ?? [])];
        updatedParams[index] = {
          ...updatedParams[index],
          [property]: event.target.value,
        };
        return {
          ...prevState,
          params: updatedParams,
        };
      });
    },
    [setRoute],
  );

  const handleChangePattern = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    setPattern(target.value);
  }, []);

  const handleChangePatternMessage = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    setPatternMessage(target.value);
  }, []);

  const handleChangeMultiple = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    setIsMultiple(target.checked);
  }, []);

  const handleChangeRequired = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    setRequired(target.checked);
  }, []);

  const handleChangeInitialQuery = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    setInitialQuery(target.checked);
  }, []);

  const handleChangeIsDecisionField = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    setIsDecision(target.checked);
  }, []);

  const handleChangeIsDisabledPast = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    setIsDisabledPast(target.checked);
  }, []);

  const handleChangeRepeatable = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    setRepeatable(target.checked);
  }, []);

  const handleChangeType = useCallback((_: SyntheticEvent, value: (typeof fields)[number]) => {
    setType(value.type);
    setIsDecision(false);
    setRequired(false);
    setRepeatable(false);
    setIsDisabledPast(false);
  }, []);

  const handleChangeTreeSelect = useCallback(({ target }: SelectChangeEvent) => {
    setTreeSelected(target.value);
  }, []);

  const handleChangeMessage = useCallback(
    (nameMessage: "on" | "off") =>
      ({ target }: ChangeEvent<HTMLInputElement>) => {
        setMessages((currentState) => ({
          ...currentState,
          [nameMessage]: target.value,
        }));
      },
    [],
  );

  const handleChangeHelperText = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    setHelperText(target.value);
  }, []);

  const handleAddValue = useCallback(() => {
    setValues((prevState) => {
      const lastId = Number(prevState[prevState.length - 1].id);
      const nextId = String(lastId + 1);
      return [...prevState, { ...defaultValues[0], id: nextId }];
    });
  }, [defaultValues]);

  const handleAddParams = useCallback(() => {
    setRoute((prevRoute) => {
      const lastId = Number(prevRoute.params?.[prevRoute.params.length - 1]?.id || 0);
      const nextId = String(lastId + 1);
      const newParams = [...(prevRoute.params || []), { id: nextId, key: "", value: "" }];
      return { ...prevRoute, params: newParams };
    });
  }, []);

  const handleDeleteValue = useCallback(({ currentTarget }: MouseEvent<HTMLButtonElement>) => {
    setValues((prevState) => prevState.filter(({ id }) => currentTarget.value !== id));
  }, []);

  const handleDeleteParam = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    const buttonValue = e.currentTarget.value;
    setRoute((prevRoute) => {
      const updatedParams = (prevRoute.params ?? []).filter(({ id }) => id !== buttonValue);
      const nextParams = updatedParams.length > 0 ? updatedParams : undefined;

      return {
        ...prevRoute,
        params: nextParams,
      };
    });
  }, []);

  const getNestedChildren = useCallback((hierarchyPointNode: null | HierarchyPointNode<TreeNode>, index: number) => {
    const nestedChildren = hierarchyPointNode?.children?.[index]?.data?.children;

    if (!nestedChildren) {
      return [];
    }

    return nestedChildren.map(({ uuid: childrenUuid, attributes, children }) => ({
      attributes,
      children,
      uuid: childrenUuid,
    }));
  }, []);

  const getChildren = useCallback(
    (depth: number) => {
      if (!isDecision) {
        return [];
      }

      return values
        ?.filter((_, index) => !getDisabledValueField(index)) // filter disabled value
        ?.map(({ message: decisionMessage, value: decisionValue, label: decisionLabel }, index) => {
          const nextUuid = `${uuid}:${decisionValue}`;
          const children = getNestedChildren(currentHierarchyPointNode, index);

          return {
            attributes: {
              depth: depth + 1,
              label: decisionLabel,
              name: `${name}:${decisionValue}`,
              value: decisionValue,
              ...(decisionMessage && { message: decisionMessage }),
              ...(children.length === 0 && { isLeaf: true }),
            },
            children,
            uuid: nextUuid,
          };
        });
    },
    [currentHierarchyPointNode, getDisabledValueField, getNestedChildren, isDecision, name, uuid, values],
  );

  const getTreeValuesWithoutEmptyMessage = useCallback(
    (valuesData: TreeValues[]) =>
      valuesData.map(({ message, ...rest }) => ({
        ...rest,
        ...(message && { message }),
      })),
    [],
  );

  const getWorkFlowReq = useCallback(
    (isTreeSelected: boolean, isEdit: boolean, isOtherTree: boolean) => {
      // make request if is Tree and not update or isOtherTree selected
      if (isTreeSelected && (!isEdit || isOtherTree)) {
        try {
          return fetchWorkflow();
        } catch (e) {
          open(t("error.fetchTree", { ns: "snackMessage" }), "error");
        }
      }

      // don't edit tree
      if (isTreeSelected && isEdit && !isOtherTree) {
        return {
          data: { workflow: currentHierarchyPointNode?.data.attributes?.tree },
          isError: null,
        };
      }

      return { data: null, isError: null };
    },
    [currentHierarchyPointNode?.data.attributes?.tree, fetchWorkflow, open, t],
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const { on, off } = messages;
      const currentUuid = currentHierarchyPointNode?.data?.uuid || "";
      const currentDepth = currentHierarchyPointNode?.depth || 0;
      const isEdit = modalOpen === "edit";
      const depth = currentDepth + (isEdit || currentHierarchyPointNode === null ? 0 : 1);
      const childOfChildren = getChildren(depth);
      const currentPath = treePath?.at(-1)?.path;
      const newPath = treePath.length ? `${currentPath}/${uuid}` : `/${uuid}`;
      const isOtherTree = currentHierarchyPointNode?.data.attributes?.tree?.treeId !== treeSelected;
      const { data: workflow, isError } = await getWorkFlowReq(isTreeField, isEdit, isOtherTree);

      if (isError) {
        return;
      }

      const children = {
        attributes: {
          depth,
          name,
          type,
          ...(label && { label }),
          ...(isAutocomplete && { route }),
          ...(isDynamicSelect && { route }),
          ...(helperText && { helperText }),
          ...(isDecision && { isDecision }),
          ...(required && { required }),
          ...(isDisabledPast && isDateRangePicker && { isDisabledPast }),
          ...(repeatable && { repeatable }),
          ...(isHiddenField && { hiddenValue }),
          ...(tag && { tag }),
          ...(parentRef && { parentRef }),
          ...(isMultiple && isMultiplePossible && { isMultiple }),
          ...(initialQuery && { initialQuery }),
          ...(isDecisionField && !isDecision && { values: getTreeValuesWithoutEmptyMessage(values) }),
          ...((off || on) && { messages: { ...(off && { off }), ...(on && { on }) } }),
          ...(isTreeField && {
            tree: { ...workflow?.workflow, treeId: treeSelected } as TreeNode,
            treePath: newPath,
          }),
        },
        children: childOfChildren,
        uuid: isEdit ? currentUuid : uuid,
      };

      if (isEdit) {
        dispatchTree(replaceTreeCard(currentPath || "", currentUuid, children));
      } else {
        dispatchTree(appendTreeCard(currentPath || null, currentUuid, children));
      }

      setModalOpen(null);
    },
    [
      messages,
      currentHierarchyPointNode,
      modalOpen,
      getChildren,
      treePath,
      uuid,
      treeSelected,
      getWorkFlowReq,
      isTreeField,
      name,
      type,
      label,
      isAutocomplete,
      route,
      isDynamicSelect,
      helperText,
      isDecision,
      required,
      isDisabledPast,
      isDateRangePicker,
      repeatable,
      isHiddenField,
      hiddenValue,
      tag,
      parentRef,
      isMultiple,
      isMultiplePossible,
      initialQuery,
      isDecisionField,
      getTreeValuesWithoutEmptyMessage,
      values,
      setModalOpen,
      dispatchTree,
    ],
  );

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

      setTag(currentHierarchyPointNode?.data.attributes?.tag || null);
      setType(currentHierarchyPointNode?.data.attributes?.type || "text");
      setHelperText(currentHierarchyPointNode?.data.attributes?.helperText || "");
      setRequired(currentHierarchyPointNode?.data.attributes?.required || false);
      setIsDisabledPast(currentHierarchyPointNode?.data.attributes?.isDisabledPast || false);
      setLabel(currentHierarchyPointNode?.data.attributes?.label || "");
      setName(currentHierarchyPointNode?.data.attributes?.name || "");
      setIsDecision(currentHierarchyPointNode?.data.attributes?.isDecision || false);
      setValues(initialValues?.length ? initialValues : defaultValues);
      setTreeSelected(currentHierarchyPointNode?.data.attributes?.tree?.treeId || "");
      setRepeatable(currentHierarchyPointNode?.data.attributes?.repeatable || false);
      setHiddenValue(currentHierarchyPointNode?.data.attributes?.hiddenValue || "");
      setParentRef(currentHierarchyPointNode?.data.attributes?.parentRef || null);

      setMessages({
        off: currentHierarchyPointNode?.data.attributes?.messages?.off || "",
        on: currentHierarchyPointNode?.data.attributes?.messages?.on || "",
      });

      setRoute((prevRoute) => ({
        ...prevRoute,
        params: currentHierarchyPointNode?.data.attributes?.route?.params,
        pathKey: currentHierarchyPointNode?.data.attributes?.route?.pathKey,
        searchKey: currentHierarchyPointNode?.data.attributes?.route?.searchKey,
        url: currentHierarchyPointNode?.data.attributes?.route?.url || "",
      }));

      setIsMultiple(isMultipleAttribute || false);

      setInitialQuery(currentHierarchyPointNode?.data.attributes?.initialQuery || false);
    }
  }, [
    currentHierarchyPointNode?.data.attributes?.helperText,
    currentHierarchyPointNode?.data.attributes?.hiddenValue,
    currentHierarchyPointNode?.data.attributes?.initialQuery,
    currentHierarchyPointNode?.data.attributes?.isDecision,
    currentHierarchyPointNode?.data.attributes?.isDisabledPast,
    currentHierarchyPointNode?.data.attributes?.label,
    currentHierarchyPointNode?.data.attributes?.messages?.off,
    currentHierarchyPointNode?.data.attributes?.messages?.on,
    currentHierarchyPointNode?.data.attributes?.name,
    currentHierarchyPointNode?.data.attributes?.parentRef,
    currentHierarchyPointNode?.data.attributes?.repeatable,
    currentHierarchyPointNode?.data.attributes?.required,
    currentHierarchyPointNode?.data.attributes?.route?.params,
    currentHierarchyPointNode?.data.attributes?.route?.pathKey,
    currentHierarchyPointNode?.data.attributes?.route?.searchKey,
    currentHierarchyPointNode?.data.attributes?.route?.url,
    currentHierarchyPointNode?.data.attributes?.step,
    currentHierarchyPointNode?.data.attributes?.tag,
    currentHierarchyPointNode?.data.attributes?.tree?.treeId,
    currentHierarchyPointNode?.data.attributes?.type,
    currentHierarchyPointNode?.data.attributes?.values,
    currentHierarchyPointNode?.data?.children,
    currentHierarchyPointNode?.data.uuid,
    defaultValues,
    isMultipleAttribute,
    modalOpen,
  ]);

  return {
    getDisabledValueField,
    handleAddParams,
    handleAddValue,
    handleChangeHelperText,
    handleChangeHiddenValue,
    handleChangeInitialQuery,
    handleChangeIsDecisionField,
    handleChangeIsDisabledPast,
    handleChangeLabel,
    handleChangeMessage,
    handleChangeMultiple,
    handleChangeName,
    handleChangeParam,
    handleChangeParentRef,
    handleChangePath,
    handleChangePattern,
    handleChangePatternMessage,
    handleChangeRepeatable,
    handleChangeRequired,
    handleChangeSearchKey,
    handleChangeTag,
    handleChangeTreeSelect,
    handleChangeType,
    handleChangeUrl,
    handleChangeUrlSelect,
    handleDeleteParam,
    handleDeleteValue,
    handlePresetValues,
    handleSubmit,
    helperText,
    hiddenValue,
    initialQuery,
    isAutocomplete,
    isBooleanField,
    isDateRangePicker,
    isDecision,
    isDecisionField,
    isDisabledPast,
    isDynamicSelect,
    isEditModal,
    isHiddenField,
    isLeaf,
    isMultiple,
    isMultiplePossible,
    isRepeatableDisabled,
    isRequiredDisabled,
    isTreeField,
    isWorkflowLoading,
    label,
    messages,
    name,
    parentRef,
    pattern,
    patternMessage,
    repeatable,
    required,
    route,
    tag,
    treeSelected,
    type,
    uuid,
    values,
  };
};

export default useFormTreeCardMutation;
