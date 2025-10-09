import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectLanguage, { Language } from "@/features/Treege/Inputs/SelectLanguage";
import { GroupNodeData } from "@/features/Treege/Nodes/GroupNode";
import useFlowActions from "@/hooks/useFlowActions";
import useNodesSelection from "@/hooks/useNodesSelection";

const GroupNodeForm = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const { selectedNode } = useNodesSelection<GroupNodeData>();
  const { updateSelectedNodeData } = useFlowActions();

  const { handleSubmit, Field } = useForm({
    defaultValues: {
      label: selectedNode?.data?.label || { en: "" },
    } as GroupNodeData,
    listeners: {
      onChange: ({ formApi }) => {
        formApi.handleSubmit().then();
      },
      onChangeDebounceMs: 500,
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
      <div className="flex gap-2 items-end">
        <Field
          name="label"
          listeners={{
            onChange: () => {
              handleSubmit().then();
            },
            onChangeDebounceMs: 150,
          }}
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
    </form>
  );
};

export default GroupNodeForm;
