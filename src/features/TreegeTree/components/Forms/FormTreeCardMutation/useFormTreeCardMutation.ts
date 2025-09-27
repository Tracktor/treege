import { SelectChangeEvent, useSnackbar } from "@tracktor/design-system";
import type { DefaultValueFromAncestor, Params, Route, TreeNode, TreeNodeField, TreeValues } from "@tracktor/types-treege";
import type { HierarchyPointNode } from "d3-hierarchy";
import { ChangeEvent, FormEvent, MouseEvent, SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import fields from "@/constants/fields";
import { appendTreeCard, replaceTreeCard } from "@/features/TreegeTree/reducer/treeReducer";
import useTreegeContext from "@/hooks/useTreegeContext";
import useWorkflowQuery from "@/services/workflows/query/useWorkflowQuery";
import { getUUID } from "@/utils";
import { findNodeByUUIDInTree, getAllAncestorFromTree, getTree } from "@/utils/tree";

interface Values {
  id: string;
  label: string;
  value: string;
  message?: string;
}

const useFormTreeCardMutation = () => {
  const uuidRef = useRef(getUUID());
  const uuid = uuidRef.current;
  const defaultValues = useMemo(() => [{ id: "0", label: "", message: "", value: "" }], []);
  const { dispatchTree, currentHierarchyPointNode, modalOpen, treePath, setModalOpen, tree } = useTreegeContext();
  const { openSnackbar } = useSnackbar();
  const { t } = useTranslation(["translation", "form"]);

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
  const [route, setRoute] = useState<Route | undefined>(undefined);
  const [treeSelected, setTreeSelected] = useState<string>("");
  const [helperText, setHelperText] = useState("");
  const [messages, setMessages] = useState({ off: "", on: "" });
  const [repeatable, setRepeatable] = useState(false);
  const [initialQuery, setInitialQuery] = useState(false);
  const [pattern, setPattern] = useState<string | null | { label: string; value: string }>("");
  const [patternMessage, setPatternMessage] = useState("");
  const [defaultValueFromAncestor, setDefaultValueFromAncestor] = useState<DefaultValueFromAncestor | undefined>(undefined);
  const [selectAncestorName, setSelectAncestorName] = useState<string | undefined>("");
  const validDynamicUrlParams = [...(route?.url?.matchAll(/{(.*?)}/g) ?? [])].filter((m) => m[1] !== "").map((m) => m[0]);

  // State
  const isTreeField = type === "tree";
  const isHiddenField = type === "hidden";
  const isAutocomplete = type === "autocomplete";
  const isDateRangePicker = type === "dateRange";
  const isDynamicSelect = type === "dynamicSelect";
  const isBooleanField = fields.some((field) => field.type === type && field?.isBooleanField);
  const isDecisionField = fields.some((field) => field.type === type && field?.isDecisionField);
  const isRequiredDisabled = fields.some((field) => field.type === type && field?.isRequiredDisabled);
  const isRepeatableDisabled = fields.some((field) => field.type === type && field?.isRepeatableDisabled);
  const isPatternEnabled = fields.some((field) => field.type === type && field?.isPatternEnabled);
  const isMultiplePossible = fields.some((field) => field.type === type && "isMultiple" in field);
  const isEditModal = modalOpen === "edit";

  // Tree state
  const currentUuid = currentHierarchyPointNode?.data?.uuid || "";
  const currentTree = getTree(tree, treePath?.at(-1)?.path);
  const displayAncestorOnNewNodeWithAncestor = !isEditModal && !!currentUuid;
  const hideCurrentUuid = displayAncestorOnNewNodeWithAncestor ? undefined : currentUuid;
  const ancestors = getAllAncestorFromTree(currentTree, currentUuid, hideCurrentUuid);
  const ancestorsName = useMemo(() => ancestors.map(({ name: getNames }) => getNames || ""), [ancestors]);
  const getDisabledValueField = useCallback((index: number) => !isDecisionField && index > 0, [isDecisionField]);
  const hasAncestors = !!ancestorsName.length;
  const hasApiConfig = isAutocomplete || isDynamicSelect;

  const { refetch: fetchWorkflow, isLoading: isWorkflowLoading } = useWorkflowQuery(treeSelected, { enabled: false });

  const patternOptions = useMemo(
    () => [
      { label: t("form:number"), value: "^\\d+$" },
      { label: t("form:letter"), value: "^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$" },
      { label: t("form:numberAndLetter"), value: "^[A-Za-z0-9]+$" },
      { label: t("form:cardNumber"), value: "^\\d{16}$" },
      { label: t("form:type.date"), value: "\\d{4}-\\d{2}-\\d{2}" },
    ],
    [t],
  );

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

  const handleChangeHiddenValue = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    setHiddenValue(target.value);
  }, []);

  const handleChangeLabel = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    setLabel(target.value);
  }, []);

  const handleChangeName = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    setName(target.value);
  }, []);

  const handleChangeUrlSelect = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    const newValue = target.value;

    setRoute((prevState) => ({ ...prevState, url: newValue }));
  }, []);

  const handleChangeSearchKey = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    setRoute((prevState) => {
      const { searchKey, ...rest } = prevState ?? {};

      const { value } = target;
      if (value === "") {
        return Object.keys(rest).length > 0 ? rest : undefined;
      }

      return {
        ...rest,
        searchKey: value,
      };
    });
  }, []);

  const handleChangePath = useCallback(<T extends HTMLInputElement | HTMLTextAreaElement>(property: string, event: ChangeEvent<T>) => {
    setRoute((prevState) => {
      const safeState = prevState ?? {};
      const safePathKey = safeState.pathKey ?? {};

      const updatedPathKey = {
        ...safePathKey,
        [property]: event.target.value,
      };

      if (event.target.value === "" && property in updatedPathKey) {
        const { pathKey, ...nextState } = safeState;
        return Object.keys(nextState).length > 0 ? nextState : undefined;
      }

      return {
        ...safeState,
        pathKey: updatedPathKey,
      };
    });
  }, []);

  const handleChangeParam = useCallback(<K extends keyof Params>(index: number, property: K, value: Params[K]) => {
    setRoute((prevState) => {
      const safeState = prevState ?? {};
      const currentParams = [...(safeState.params ?? [])];
      const currentParam = { ...(currentParams[index] ?? {}) };

      if (value === "" || value === false) {
        delete currentParam[property];
      } else {
        currentParam[property] = value;
      }

      const isParamEmpty = Object.values(currentParam).every((v) => v === "" || v === false || v === undefined);

      if (isParamEmpty) {
        currentParams.splice(index, 1);
      } else {
        currentParams[index] = currentParam;
      }

      if (currentParams.length === 0) {
        const { params, ...rest } = safeState;
        return Object.keys(rest).length > 0 ? rest : undefined;
      }

      return {
        ...safeState,
        params: currentParams,
      };
    });
  }, []);

  const handleChangePattern = (_: SyntheticEvent, value: null | string | { label: string; value: string }) => {
    setPattern(value);
  };

  const handleChangePatternMessage = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setPatternMessage(target.value);
  };

  const handleChangeMultiple = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setIsMultiple(target.checked);
  };

  const handleChangeRequired = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setRequired(target.checked);
  };

  const handleChangeInitialQuery = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setInitialQuery(target.checked);
  };

  const handleChangeIsDecisionField = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setIsDecision(target.checked);
  };

  const handleChangeIsDisabledPast = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setIsDisabledPast(target.checked);
  };

  const handleChangeRepeatable = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setRepeatable(target.checked);
  };

  const handleChangeType = (_: SyntheticEvent, value: (typeof fields)[number]) => {
    setType(value.type);
    setIsDecision(false);
    setRequired(false);
    setRepeatable(false);
    setIsDisabledPast(false);
  };

  const handleChangeTreeSelect = ({ target }: SelectChangeEvent) => {
    setTreeSelected(target.value);
  };

  const handleChangeMessage =
    (nameMessage: "on" | "off") =>
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      setMessages((currentState) => ({
        ...currentState,
        [nameMessage]: target.value,
      }));
    };

  const handleChangeHelperText = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setHelperText(target.value);
  };

  const handleAddValue = useCallback(() => {
    setValues((prevState) => {
      const lastId = Number(prevState[prevState.length - 1].id);
      const nextId = String(lastId + 1);
      return [...prevState, { ...defaultValues[0], id: nextId }];
    });
  }, [defaultValues]);

  const handleAddParams = () => {
    setRoute((prevRoute) => {
      const safeRoute = prevRoute ?? {};
      const currentParams = [...(safeRoute.params ?? [])];

      const lastId = Number(currentParams[currentParams.length - 1]?.id || 0);
      const nextId = String(lastId + 1);

      const newParams: Params[] = [
        ...currentParams,
        {
          id: nextId,
          key: "",
        },
      ];

      return {
        ...safeRoute,
        params: newParams,
      };
    });
  };

  const handleDeleteValue = ({ currentTarget }: MouseEvent<HTMLButtonElement>) => {
    setValues((prevState) => prevState.filter(({ id }) => currentTarget.value !== id));
  };

  const handleDeleteParam = (arg: MouseEvent<HTMLButtonElement> | string) => {
    const id = typeof arg === "string" ? arg : arg.currentTarget.value;

    setRoute((prevRoute) => {
      const safeRoute = prevRoute ?? {};
      const currentParams = safeRoute.params ?? [];

      const updatedParams = currentParams.filter((param) => param.id !== id);
      const nextParams = updatedParams.length > 0 ? updatedParams : undefined;

      return {
        ...safeRoute,
        params: nextParams,
      };
    });
  };

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
          openSnackbar({ message: t("error.fetchTree", { ns: "snackMessage" }), severity: "error" });
        }
      }

      // don't edit a tree
      if (isTreeSelected && isEdit && !isOtherTree) {
        return {
          data: { workflow: currentHierarchyPointNode?.data.attributes?.tree },
          isError: null,
        };
      }

      return { data: null, isError: null };
    },
    [currentHierarchyPointNode?.data.attributes?.tree, fetchWorkflow, openSnackbar, t],
  );

  const handleValueFromAncestor = (sourceValue?: string) => {
    setDefaultValueFromAncestor((prevState) => {
      const nextState = { ...(prevState ?? {}) };

      if (sourceValue) {
        nextState.sourceValue = sourceValue;
      } else {
        delete nextState.sourceValue;
      }

      return Object.keys(nextState).length > 0 ? nextState : undefined;
    });
  };

  const handleAncestorRef = (ancestorUuid?: string, ancestorName?: string) => {
    setDefaultValueFromAncestor((prevState) => {
      const nextState = { ...(prevState ?? {}) };

      if (ancestorUuid) {
        nextState.uuid = ancestorUuid;
      } else {
        delete nextState.uuid;
      }

      return Object.keys(nextState).length > 0 ? nextState : undefined;
    });

    setSelectAncestorName(ancestorName);
  };

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const { on, off } = messages;
      const currentDepth = currentHierarchyPointNode?.depth || 0;
      const depth = currentDepth + (isEditModal || currentHierarchyPointNode === null ? 0 : 1);
      const childOfChildren = getChildren(depth);
      const currentPath = treePath?.at(-1)?.path;
      const newPath = treePath.length ? `${currentPath}/${uuid}` : `/${uuid}`;
      const isOtherTree = currentHierarchyPointNode?.data.attributes?.tree?.treeId !== treeSelected;
      const { data: workflow, isError } = await getWorkFlowReq(isTreeField, isEditModal, isOtherTree);

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
          ...(isMultiple && isMultiplePossible && { isMultiple }),
          ...(initialQuery && { initialQuery }),
          ...(isDecisionField && !isDecision && { values: getTreeValuesWithoutEmptyMessage(values) }),
          ...((off || on) && { messages: { ...(off && { off }), ...(on && { on }) } }),
          ...(pattern && { pattern: typeof pattern === "object" ? pattern.value : pattern }),
          ...(patternMessage && { patternMessage }),
          ...(defaultValueFromAncestor && { defaultValueFromAncestor }),
          ...(isTreeField && {
            tree: { ...workflow?.workflow, treeId: treeSelected } as TreeNode,
            treePath: newPath,
          }),
        },
        children: childOfChildren,
        uuid: isEditModal ? currentUuid : uuid,
      };

      if (isEditModal) {
        dispatchTree(replaceTreeCard(currentPath || "", currentUuid, children));
      } else {
        dispatchTree(appendTreeCard(currentPath || null, currentUuid, children));
      }

      setModalOpen(null);
    },
    [
      isEditModal,
      currentHierarchyPointNode,
      currentUuid,
      defaultValueFromAncestor,
      dispatchTree,
      getChildren,
      getTreeValuesWithoutEmptyMessage,
      getWorkFlowReq,
      helperText,
      hiddenValue,
      initialQuery,
      isAutocomplete,
      isDateRangePicker,
      isDecision,
      isDecisionField,
      isDisabledPast,
      isDynamicSelect,
      isHiddenField,
      isMultiple,
      isMultiplePossible,
      isTreeField,
      label,
      messages,
      name,
      pattern,
      patternMessage,
      repeatable,
      required,
      route,
      setModalOpen,
      tag,
      treePath,
      treeSelected,
      type,
      uuid,
      values,
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

      const ancestorIdToSearch = currentHierarchyPointNode?.data?.attributes?.defaultValueFromAncestor?.uuid;
      const ancestor = ancestorIdToSearch ? findNodeByUUIDInTree(currentTree, ancestorIdToSearch) : undefined;
      const savedAncestor = ancestor?.attributes?.name;

      setSelectAncestorName(savedAncestor);
      setDefaultValueFromAncestor(currentHierarchyPointNode?.data?.attributes?.defaultValueFromAncestor || undefined);
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
      setPattern(
        patternOptions.find(({ value }) => value === currentHierarchyPointNode?.data.attributes?.pattern) ||
          currentHierarchyPointNode?.data.attributes?.pattern ||
          "",
      );
      setPatternMessage(currentHierarchyPointNode?.data.attributes?.patternMessage || "");

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

      setDefaultValueFromAncestor(currentHierarchyPointNode?.data?.attributes?.defaultValueFromAncestor || undefined);
    }
  }, [
    currentHierarchyPointNode?.data.attributes?.defaultValueFromAncestor,
    currentHierarchyPointNode?.data.attributes?.helperText,
    currentHierarchyPointNode?.data.attributes?.hiddenValue,
    currentHierarchyPointNode?.data.attributes?.initialQuery,
    currentHierarchyPointNode?.data.attributes?.isDecision,
    currentHierarchyPointNode?.data.attributes?.isDisabledPast,
    currentHierarchyPointNode?.data.attributes?.label,
    currentHierarchyPointNode?.data.attributes?.messages?.off,
    currentHierarchyPointNode?.data.attributes?.messages?.on,
    currentHierarchyPointNode?.data.attributes?.name,
    currentHierarchyPointNode?.data.attributes?.pattern,
    currentHierarchyPointNode?.data.attributes?.patternMessage,
    currentHierarchyPointNode?.data.attributes?.repeatable,
    currentHierarchyPointNode?.data.attributes?.required,
    currentHierarchyPointNode?.data.attributes?.route?.params,
    currentHierarchyPointNode?.data.attributes?.route?.pathKey,
    currentHierarchyPointNode?.data.attributes?.route?.searchKey,
    currentHierarchyPointNode?.data.attributes?.route?.url,
    currentHierarchyPointNode?.data.attributes?.tag,
    currentHierarchyPointNode?.data.attributes?.tree?.treeId,
    currentHierarchyPointNode?.data.attributes?.type,
    currentHierarchyPointNode?.data.attributes?.values,
    currentHierarchyPointNode?.data?.children,
    currentTree,
    defaultValues,
    isMultipleAttribute,
    modalOpen,
    patternOptions,
  ]);

  return {
    ancestors,
    currentTree,
    defaultValueFromAncestor,
    getDisabledValueField,
    handleAddParams,
    handleAddValue,
    handleAncestorRef,
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
    handleChangePath,
    handleChangePattern,
    handleChangePatternMessage,
    handleChangeRepeatable,
    handleChangeRequired,
    handleChangeSearchKey,
    handleChangeTag,
    handleChangeTreeSelect,
    handleChangeType,
    handleChangeUrlSelect,
    handleDeleteParam,
    handleDeleteValue,
    handlePresetValues,
    handleSubmit,
    handleValueFromAncestor,
    hasAncestors,
    hasApiConfig,
    helperText,
    hiddenValue,
    initialQuery,
    isAutocomplete,
    isBooleanField,
    isDateRangePicker,
    isDecision,
    isDecisionField,
    isDisabledPast,
    isHiddenField,
    isMultiple,
    isMultiplePossible,
    isPatternEnabled,
    isRepeatableDisabled,
    isRequiredDisabled,
    isTreeField,
    isWorkflowLoading,
    label,
    messages,
    name,
    pattern,
    patternMessage,
    patternOptions,
    repeatable,
    required,
    route,
    selectAncestorName,
    tag,
    treeSelected,
    type,
    uuid,
    validDynamicUrlParams,
    values,
  };
};

export default useFormTreeCardMutation;
