import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectLanguage, { Language } from "@/features/Treege/Inputs/SelectLanguage";
import { UINodeData } from "@/features/Treege/Nodes/UINode";
import useFlow from "@/hooks/useFlow";

const UINodeForm = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const { updateSelectedNodeData, selectedNode } = useFlow();

  const { handleSubmit, Field } = useForm({
    defaultValues: {
      label: selectedNode?.data?.label || { en: "" },
      type: selectedNode?.data?.type || "title",
    } as UINodeData,
    onSubmit: async ({ value }) => {
      updateSelectedNodeData(value);
    },
  });

  return (
    <form
      id="ui-node-form"
      onChange={handleSubmit}
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
          name="type"
          children={(field) => (
            <SelectGroup>
              <SelectLabel>Type</SelectLabel>
              <Select value={field.state.value} onValueChange={(newValue) => field.handleChange(newValue)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="divider">Divider</SelectItem>
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
