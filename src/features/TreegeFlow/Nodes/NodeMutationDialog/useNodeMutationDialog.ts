import { useForm } from "@tanstack/react-form";
import type { TreeNode } from "@tracktor/types-treege";
import { FormEvent, useCallback } from "react";
import getCategoryOrTypes from "@/features/TreegeFlow/utils/getCategoryOrTypes";
import { getUUID } from "@/utils";

interface ChildFormValues {
  uuid?: string;
  label: string;
  message?: string;
  name: string;
  value: string;
  type?: string;
  isDecision?: boolean;
}

interface NodeConfigModalForm {
  category: string;
  children: ChildFormValues[];
  isDecision: boolean;
  label: string;
  name: string;
  type: string;
  value: string;
}

interface UseNodeMutationDialogProps {
  initialValues?: TreeNode["attributes"] & { children?: TreeNode[] };
  onClose: () => void;
  onSave: (attributes: TreeNode["attributes"] & { children?: TreeNode[] }) => void;
}

const useNodeMutationDialog = ({ initialValues, onSave, onClose }: UseNodeMutationDialogProps) => {
  const categoryOrType = initialValues?.type ? getCategoryOrTypes(initialValues.type) : null;
  const initialCategory = typeof categoryOrType === "string" ? String(categoryOrType) : "textArea";

  const initialChildren: ChildFormValues[] =
    initialValues?.children?.map((c) => {
      if ("type" in c.attributes) {
        return {
          isDecision: c.attributes.isDecision ?? false,
          label: c.attributes.label ?? "",
          message: "",
          name: c.attributes.name,
          type: c.attributes.type,
          uuid: c.uuid,
          value: c.attributes.values?.[0]?.value ?? "",
        };
      }

      return {
        isDecision: false,
        label: c.attributes.label ?? "",
        message: c.attributes.message ?? "",
        name: c.attributes.name,
        type: "option",
        uuid: c.uuid,
        value: c.attributes.value ?? "",
      };
    }) ?? [];

  const {
    Field,
    handleSubmit,
    reset,
    state: { values },
    setFieldValue,
    Subscribe,
  } = useForm({
    defaultValues: {
      category: initialCategory,
      children: initialChildren,
      isDecision: initialValues?.isDecision ?? false,
      label: initialValues?.label ?? "",
      name: initialValues?.name ?? "",
      type: initialValues?.type ?? "text",
      value: initialValues?.value ?? "",
    } as NodeConfigModalForm,
    onSubmit: ({ value }) => {
      const updatedChildren: TreeNode[] = value.children.map((child) => {
        const uuid = child.uuid ?? getUUID();

        const childAttributes: TreeNode["attributes"] = {
          depth: 1,
          label: child.label,
          message: child.message,
          name: `${value.name}:${child.value}`,
          // todo: fix type casting
          type: "option" as any,
          value: child.value,
        };

        return { attributes: childAttributes, children: [], uuid };
      });

      const nodeAttributes: TreeNode["attributes"] =
        value.type && value.type !== "option"
          ? {
              depth: 0,
              isDecision: value.isDecision,
              label: value.label,
              name: value.name,
              // todo: fix type casting
              type: value.type as any,
              values: value.value ? [{ id: value.name, label: value.label, value: value.value }] : undefined,
            }
          : {
              depth: 0,
              label: value.label,
              message: undefined,
              name: value.name,
              value: value.value,
            };

      onSave({
        ...nodeAttributes,
        children: updatedChildren,
      });

      reset();
      onClose();
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleAddChild = useCallback(() => {
    const newChildren = [
      ...values.children,
      {
        label: "",
        message: "",
        name: `${values.name}:`,
        uuid: getUUID(),
        value: "",
      },
    ];
    setFieldValue("children", newChildren);
  }, [setFieldValue, values.children, values.name]);

  const setChildren = (children: ChildFormValues[]) => {
    setFieldValue("children", children);
  };

  const onSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit().then();
  };

  return {
    Field,
    handleAddChild,
    handleClose,
    initialValues,
    onSubmitForm,
    reset,
    setChildren,
    setFieldValue,
    Subscribe,
    values,
  };
};

export default useNodeMutationDialog;
