import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import SelectLanguage from "@/editor/features/TreegeEditor/inputs/SelectLanguage";
import useFlowActions from "@/editor/hooks/useFlowActions";
import useNodesSelection from "@/editor/hooks/useNodesSelection";
import { FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Language } from "@/shared/types/languages";
import { GroupNodeData } from "@/shared/types/node";

const GroupNodeForm = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const { selectedNode } = useNodesSelection<GroupNodeData>();
  const { updateSelectedNodeData } = useFlowActions();

  const { Field } = useForm({
    defaultValues: {
      label: selectedNode?.data?.label || { en: "" },
    } as GroupNodeData,
    listeners: {
      onChange: ({ formApi }) => {
        formApi.handleSubmit().then();
      },
      onChangeDebounceMs: 150,
    },
    onSubmit: ({ value }) => {
      updateSelectedNodeData(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="flex items-end gap-2">
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
    </form>
  );
};

export default GroupNodeForm;
