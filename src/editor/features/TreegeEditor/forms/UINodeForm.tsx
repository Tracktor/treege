import { useForm } from "@tanstack/react-form";
import { useId, useState } from "react";
import SelectLanguage from "@/editor/features/TreegeEditor/inputs/SelectLanguage";
import useFlowActions from "@/editor/hooks/useFlowActions";
import useNodesSelection from "@/editor/hooks/useNodesSelection";
import { FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { UI_TYPE } from "@/shared/constants/uiType";
import { Language } from "@/shared/types/languages";
import { UINodeData, UIType } from "@/shared/types/node";

const UINodeForm = () => {
  const formId = useId();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const { selectedNode } = useNodesSelection<UINodeData>();
  const { updateSelectedNodeData } = useFlowActions();

  const { Field } = useForm({
    defaultValues: {
      label: selectedNode?.data?.label || { en: "" },
      type: selectedNode?.data?.type,
    } as UINodeData,
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
      id={`${formId}-ui-node-form`}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="grid gap-6">
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

        <Field
          name="type"
          children={(field) => (
            <SelectGroup>
              <SelectLabel>Type</SelectLabel>
              <Select value={field.state.value} onValueChange={(newValue: UIType) => field.handleChange(newValue)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={UI_TYPE.title}>Title</SelectItem>
                    <SelectItem value={UI_TYPE.divider}>Divider</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </SelectGroup>
          )}
        />
      </div>
    </form>
  );
};

export default UINodeForm;
