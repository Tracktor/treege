import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UINodeData } from "@/features/Treege/Nodes/UINode";
import useFlow from "@/hooks/useFlow";

const UINodeForm = () => {
  const { updateSelectedNodeData, selectedNode } = useFlow();

  const { handleSubmit, Field } = useForm({
    defaultValues: {
      label: selectedNode?.data?.label || "",
      type: selectedNode?.data?.type || "",
    } as UINodeData,
    onSubmit: async ({ value }) => {
      updateSelectedNodeData(value);
    },
  });

  return (
    <form id="ui-node-form" onChange={handleSubmit}>
      <div className="grid gap-6">
        <Field
          name="label"
          children={(field) => (
            <div className="grid gap-3">
              <Label htmlFor={field.name}>Label</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={({ target }) => field.handleChange(target.value)}
              />
            </div>
          )}
        />

        <Field
          name="type"
          children={(field) => (
            <div className="grid gap-3">
              <Label htmlFor={field.name}>Type</Label>
              <Input
                required
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={({ target }) => field.handleChange(target.value)}
              />
            </div>
          )}
        />
      </div>
    </form>
  );
};

export default UINodeForm;
