import { useForm } from "@tanstack/react-form";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { useState } from "react";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectLanguage, { Language } from "@/features/Treege/Inputs/SelectLanguage";
import { JsonNodeData } from "@/features/Treege/Nodes/JsonNode";
import useFlowActions from "@/hooks/useFlowActions";
import useNodesSelection from "@/hooks/useNodesSelection";

const JsonNodeForm = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const { selectedNode } = useNodesSelection<JsonNodeData>();
  const { updateSelectedNodeData } = useFlowActions();

  const { handleSubmit, Field } = useForm({
    defaultValues: {
      json: selectedNode?.data?.json || "",
      label: selectedNode?.data?.label || { en: "" },
    } as JsonNodeData,
    onSubmit: async ({ value }) => {
      updateSelectedNodeData(value);
    },
  });

  return (
    <form
      id="json-node-form"
      className="flex flex-col h-full pb-4 min-h-0"
      onChange={handleSubmit}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="flex flex-col gap-6 h-full">
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
          name="json"
          children={(field) => (
            <FormItem className="flex flex-col flex-1 min-h-0">
              <Label htmlFor={field.name}>Json</Label>
              <CodeEditor
                value={field.state.value}
                language="json"
                data-color-mode="dark"
                placeholder="Please enter JSON."
                padding={15}
                className="dark:bg-input/30"
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                  height: "100%",
                  overflowY: "auto",
                }}
                onChange={({ target }) => field.handleChange(target.value)}
              />
            </FormItem>
          )}
        />
      </div>
    </form>
  );
};

export default JsonNodeForm;
