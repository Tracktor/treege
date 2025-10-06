import { useForm } from "@tanstack/react-form";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JsonNodeData } from "@/features/Treege/Nodes/JsonNode";
import useFlow from "@/hooks/useFlow";

const JsonNodeForm = () => {
  const { updateSelectedNodeData, selectedNode } = useFlow();

  const { handleSubmit, Field } = useForm({
    defaultValues: {
      json: selectedNode?.data?.json || "",
      label: selectedNode?.data?.label || "",
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
        <Field
          name="label"
          children={(field) => (
            <FormItem>
              <Label htmlFor={field.name}>Label</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={({ target }) => field.handleChange(target.value)}
              />
            </FormItem>
          )}
        />

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
