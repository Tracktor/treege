import { useForm } from "@tanstack/react-form";
import { FormDescription, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FlowNodeData } from "@/features/Treege/Nodes/FlowNode";
import useFlow from "@/hooks/useFlow";

const FlowNodeForm = () => {
  const { updateSelectedNodeData, selectedNode } = useFlow();

  const { handleSubmit, Field } = useForm({
    defaultValues: {
      label: selectedNode?.data?.label || "",
      targetId: selectedNode?.data?.targetId || "",
    } as FlowNodeData,
    onSubmit: async ({ value }) => {
      updateSelectedNodeData(value);
    },
  });

  return (
    <form id="flow-node-form" onChange={handleSubmit}>
      <div className="grid gap-6">
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
