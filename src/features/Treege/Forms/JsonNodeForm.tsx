import { useForm } from "@tanstack/react-form";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JsonNodeData } from "@/features/Treege/Nodes/JsonNode";
import useFlow from "@/hooks/useFlow";

const InputNodeForm = () => {
  const { updateSelectedNodeData, selectedNode, clearSelection } = useFlow();

  const form = useForm({
    defaultValues: {
      json: selectedNode?.data?.json || "",
      label: selectedNode?.data?.label || "",
    } as JsonNodeData,
    onSubmit: async ({ value }) => {
      updateSelectedNodeData(value);
      clearSelection();
    },
  });

  return (
    <form
      id="edit-node-form"
      className="flex flex-col h-full pb-4 min-h-0"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit().then();
      }}
    >
      <div className="flex flex-col gap-6 h-full">
        <form.Field
          name="label"
          children={(field) => (
            <div className="grid gap-3">
              <Label htmlFor={field.name}>Label</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                  updateSelectedNodeData({ [field.name]: e.target.value });
                }}
              />
            </div>
          )}
        />

        <form.Field
          name="json"
          children={(field) => (
            <div className="flex flex-col gap-3 flex-1 min-h-0">
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
                onChange={(event) => {
                  field.handleChange(event.target.value);
                  updateSelectedNodeData({ [field.name]: event.target.value });
                }}
              />
            </div>
          )}
        />
      </div>
    </form>
  );
};

export default InputNodeForm;
