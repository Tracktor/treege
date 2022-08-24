import type { HierarchyPointNode } from "d3-hierarchy";
import type { SelectChangeEvent } from "design-system";
import { ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState } from "react";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";
import {
  appendTreeCard,
  replaceTreeCard,
  replaceTreeCardAndKeepPrevChildren,
  setIsLeaf,
  setTree,
} from "@/features/DecisionTreeGenerator/reducer/treeReducer";
import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

const useFormTreeCardMutation = () => {
  const { dispatchTree, setModalOpen, currentHierarchyPointNode, modalOpen } = useContext(DecisionTreeGeneratorContext);
  const defaultDecisionValues = useMemo(() => [{ id: "0", label: "", value: "" }], []);
  const [decisionValues, setDecisionValues] = useState(defaultDecisionValues);
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [required, setRequired] = useState(false);
  const [type, setType] = useState("");
  const [step, setStep] = useState("");
  const isDecisionField = ["select", "radio"].includes(type);
  const requiredDisabled = ["checkbox", "switch"].includes(type);

  const getDisabledValueField = (index: number) => !isDecisionField && index > 0;

  const handlePresetValues = (event: ChangeEvent<HTMLInputElement>, predicate: "value" | "label") => {
    setDecisionValues((prevState) =>
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

  const handleChangeType = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };

  const handleAddValue = () => {
    setDecisionValues((prevState) => {
      const lastId = Number(prevState[prevState.length - 1].id);
      const nextId = String(lastId + 1);
      return [...prevState, { id: nextId, label: "", value: "" }];
    });
  };

  const handleDeleteValue = (idToDelete: string) => {
    setDecisionValues((prevState) => prevState.filter(({ id }) => idToDelete !== id));
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

  const getChildren = ({ depth, hierarchyPointNode }: { depth: number; hierarchyPointNode: null | HierarchyPointNode<TreeNode> }) => {
    if (!isDecisionField) {
      return [];
    }

    return decisionValues
      ?.filter((_, index) => !getDisabledValueField(index)) // filter disabled value
      ?.map(({ value, label: optionLabel }, index) => {
        const nextName = `${name}:${value}`;
        const children = getNestedChildren(hierarchyPointNode, index);

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

  const getIsLeaf = ({
    hierarchyPointNode,
    isDecisionField,
    isEdit,
  }: {
    hierarchyPointNode: null | HierarchyPointNode<TreeNode>;
    isDecisionField: boolean;
    isEdit: boolean;
  }) => {
    if (isDecisionField) {
      return false;
    }

    return isEdit ? hierarchyPointNode?.data?.children.length === 0 : true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const currentName = currentHierarchyPointNode?.data?.name || "";
    const currentDepth = currentHierarchyPointNode?.depth || 0;
    const isEdit = modalOpen === "edit";
    const depth = currentDepth + (isEdit || currentHierarchyPointNode === null ? 0 : 1);
    const isRoot = !currentHierarchyPointNode || depth === 0;
    const childOfChildren = getChildren({ depth, hierarchyPointNode: currentHierarchyPointNode });
    const isLeaf = getIsLeaf({ hierarchyPointNode: currentHierarchyPointNode, isDecisionField, isEdit });

    const children = {
      attributes: {
        depth,
        label,
        type,
        ...(isRoot && { isRoot }),
        ...(isDecisionField && { isDecisionField }),
        ...(required && { required }),
        ...(step && { step }),
        ...(isLeaf && { isLeaf }),
      },
      children: childOfChildren,
      name,
    };

    if (currentHierarchyPointNode === null) {
      dispatchTree(setTree(children));
    } else if (isEdit) {
      dispatchTree(isDecisionField ? replaceTreeCard(currentName, children) : replaceTreeCardAndKeepPrevChildren(currentName, children));
    } else {
      dispatchTree(setIsLeaf(currentName, false));
      dispatchTree(appendTreeCard(currentName, children));
    }

    setModalOpen(null);
  };

  // Set initial form data edit modal
  useEffect(() => {
    if (modalOpen === "edit") {
      const initialValues = currentHierarchyPointNode?.data?.children
        ?.filter(({ attributes }) => !attributes?.type)
        ?.map(({ attributes }, index) => {
          const { label: optionLabel, value } = attributes || {};
          return { id: String(index), label: String(optionLabel), value: String(value) };
        });

      setName(currentHierarchyPointNode?.data.name || "");
      setType(currentHierarchyPointNode?.data.attributes?.type || "");
      setRequired(currentHierarchyPointNode?.data.attributes?.required || false);
      setStep(currentHierarchyPointNode?.data.attributes?.step || "");
      setDecisionValues(initialValues?.length ? initialValues : defaultDecisionValues);
      setLabel(currentHierarchyPointNode?.data.attributes?.label || "");
    }
  }, [
    currentHierarchyPointNode?.data.attributes?.label,
    currentHierarchyPointNode?.data.attributes?.required,
    currentHierarchyPointNode?.data.attributes?.step,
    currentHierarchyPointNode?.data.attributes?.type,
    currentHierarchyPointNode?.data?.children,
    currentHierarchyPointNode?.data.name,
    defaultDecisionValues,
    modalOpen,
  ]);

  return {
    decisionValues,
    getDisabledValueField,
    handleAddValue,
    handleChangeLabel,
    handleChangeName,
    handleChangeOptionLabel,
    handleChangeOptionValue,
    handleChangeRequired,
    handleChangeStep,
    handleChangeType,
    handleDeleteValue,
    handleSubmit,
    isDecisionField,
    label,
    name,
    required,
    requiredDisabled,
    step,
    type,
  };
};

export default useFormTreeCardMutation;
