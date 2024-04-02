import type { SelectChangeEvent } from "@tracktor/design-system";
import type { HierarchyPointNode } from "d3-hierarchy";
import { ChangeEvent, FormEvent, MouseEvent, SyntheticEvent, useCallback, useEffect, useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import fields from "@/constants/fields";
import { appendTreeCard, replaceTreeCard } from "@/features/Treege/reducer/treeReducer";
import type { Params, Route, TreeNode, TreeNodeField, TreeValues } from "@/features/Treege/type/TreeNode";
import useSnackbar from "@/hooks/useSnackbar";
import useTreegeContext from "@/hooks/useTreegeContext";
import useWorkflowQuery from "@/services/workflows/query/useWorkflowQuery";

interface Values {
  id: string;
  label: string;
  value: string;
  message?: string;
}

const useFormTreeCardMutation = () => {
  const uuid = useId();
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
  const [required, setRequired] = useState(false);
  const [isDecision, setIsDecision] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);
  const [type, setType] = useState<TreeNodeField["type"]>("text");
  const [tag, setTag] = useState<string | null>(null);
  const [parentRef, setParentRef] = useState<string | null>(null);
  const [route, setRoute] = useState<Route>({ url: "" });
  const [treeSelected, setTreeSelected] = useState<string>("");
  const [helperText, setHelperText] = useState("");
  const [step, setStep] = useState("");
  const [messages, setMessages] = useState({ off: "", on: "" });
  const [repeatable, setRepeatable] = useState(false);
  const [initialQuery, setInitialQuery] = useState(false);

  // State
  const isEditModal = modalOpen === "edit";
  const isTreeField = type === "tree";
  const isHiddenField = type === "hidden";
  const isAutocomplete = type === "autocomplete";
  const isDynamicSelect = type === "dynamicSelect";
  const isBooleanField = fields.some((field) => field.type === type && field?.isBooleanField);
  const isDecisionField = fields.some((field) => field.type === type && field?.isDecisionField);
  const isRequiredDisabled = fields.some((field) => field.type === type && field?.isRequiredDisabled);
  const isRepeatableDisabled = fields.some((field) => field.type === type && field?.isRepeatableDisabled);
  const isLeaf = currentHierarchyPointNode?.data?.attributes?.isLeaf ?? true;
  const isMultiplePossible = fields.some((field) => field.type === type && "isMultiple" in field);

  const { refetch: fetchWorkflow, isInitialLoading: isWorkflowLoading } = useWorkflowQuery(treeSelected, {
    enabled: false,
  });

  const getDisabledValueField = useCallback((index: number) => !isDecisionField && index > 0, [isDecisionField]);

  const handlePresetValues = useCallback((event: ChangeEvent<HTMLInputElement>, predicate: "value" | "label" | "message") => {
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
  }, []);

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

  const handleChangeHiddenValue = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setHiddenValue(event.target.value);
  }, []);

  const handleChangeLabel = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value);
  }, []);

  const handleChangeName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }, []);

  const handleChangeOptionLabel = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handlePresetValues(event, "label");
    },
    [handlePresetValues],
  );

  const handleChangeOptionValue = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handlePresetValues(event, "value");
    },
    [handlePresetValues],
  );

  const handleChangeOptionMessage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handlePresetValues(event, "message");
    },
    [handlePresetValues],
  );

  const handleChangeUrl = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRoute((prevState) => ({ ...prevState, url: event.target.value }));
  }, []);

  const handleChangeUrlSelect = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
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

  const handleChangeSearchKey = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRoute((prevState) => ({
      ...prevState,
      searchKey: event.target.value,
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

  const handleChangeStep = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setStep(event.target.value);
  }, []);

  const handleChangeMultiple = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setIsMultiple(event.target.checked);
  }, []);

  const handleChangeRequired = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRequired(event.target.checked);
  }, []);

  const handleChangeInitialQuery = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInitialQuery(event.target.checked);
  }, []);

  const handleChangeIsDecisionField = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setIsDecision(event.target.checked);
  }, []);

  const handleChangeRepeatable = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRepeatable(event.target.checked);
  }, []);

  const handleChangeType = useCallback((event: SelectChangeEvent<TreeNodeField["type"]>) => {
    setType(event.target.value as TreeNodeField["type"]);
    setIsDecision(false);
    setRequired(false);
    setRepeatable(false);
  }, []);

  const handleChangeTreeSelect = useCallback((event: SelectChangeEvent) => {
    setTreeSelected(event.target.value);
  }, []);

  const handleChangeMessage = useCallback(
    (nameMessage: "on" | "off") => (event: ChangeEvent<HTMLInputElement>) => {
      setMessages((currentState) => ({
        ...currentState,
        [nameMessage]: event.target.value,
      }));
    },
    [],
  );

  const handleChangeHelperText = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setHelperText(event.target.value);
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

  const handleDeleteValue = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    setValues((prevState) => prevState.filter(({ id }) => e.currentTarget.value !== id));
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
          ...(step && { step }),
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
      label,
      name,
      type,
      isAutocomplete,
      route,
      isDynamicSelect,
      helperText,
      isDecision,
      isDecisionField,
      getTreeValuesWithoutEmptyMessage,
      values,
      required,
      step,
      repeatable,
      isHiddenField,
      hiddenValue,
      tag,
      parentRef,
      isMultiple,
      isMultiplePossible,
      initialQuery,
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
      setStep(currentHierarchyPointNode?.data.attributes?.step || "");
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
    handleChangeLabel,
    handleChangeMessage,
    handleChangeMultiple,
    handleChangeName,
    handleChangeOptionLabel,
    handleChangeOptionMessage,
    handleChangeOptionValue,
    handleChangeParam,
    handleChangeParentRef,
    handleChangePath,
    handleChangeRepeatable,
    handleChangeRequired,
    handleChangeSearchKey,
    handleChangeStep,
    handleChangeTag,
    handleChangeTreeSelect,
    handleChangeType,
    handleChangeUrl,
    handleChangeUrlSelect,
    handleDeleteParam,
    handleDeleteValue,
    handleSubmit,
    helperText,
    hiddenValue,
    initialQuery,
    isAutocomplete,
    isBooleanField,
    isDecision,
    isDecisionField,
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
    repeatable,
    required,
    route,
    step,
    tag,
    treeSelected,
    type,
    uuid,
    values,
  };
};

export default useFormTreeCardMutation;
