import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { FormDescription, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectLanguage, { Language } from "@/features/Treege/Inputs/SelectLanguage";
import { FlowNodeData } from "@/features/Treege/Nodes/FlowNode";
import useFlowActions from "@/hooks/useFlowActions";
import useNodesSelection from "@/hooks/useNodesSelection";

const FlowNodeForm = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const { updateSelectedNodeData } = useFlowActions();
  const { selectedNode } = useNodesSelection<FlowNodeData>();

  const { Field } = useForm({
    defaultValues: {
      label: selectedNode?.data?.label || { en: "" },
      targetId: selectedNode?.data?.targetId || "",
    } as FlowNodeData,
    listeners: {
      onChange: ({ formApi }) => {
        formApi.handleSubmit().then();
      },
      onChangeDebounceMs: 150,
    },
    onSubmit: async ({ value }) => {
      updateSelectedNodeData(value);
    },
  });

  return (
    <form
      id="flow-node-form"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="grid gap-6">
        <div className="flex gap-2 items-end">
          <Field
            name="label"
            children={(field) => (
              <FormItem className="flex-1">
                <Label htmlFor={field.name}>Label</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value?.[selectedLanguage] || ""}
                  onBlur={field.handleBlur}
                  onChange={({ target }) => {
                    field.handleChange({
                      ...field.state.value,
                      [selectedLanguage]: target.value,
                    });
                  }}
                />
              </FormItem>
            )}
          />
          <SelectLanguage value={selectedLanguage} onValueChange={setSelectedLanguage} />
        </div>

        <Field
          name="targetId"
          children={(field) => (
            <FormItem>
              <Label htmlFor={field.name}>Target id</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={({ target }) => field.handleChange(target.value)}
              />
              <FormDescription>Unique identifier of the target flow.</FormDescription>
            </FormItem>
          )}
        />
      </div>
    </form>
  );
};

export default FlowNodeForm;
