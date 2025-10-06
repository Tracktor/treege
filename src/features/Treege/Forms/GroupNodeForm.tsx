import { useForm } from "@tanstack/react-form";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GroupNodeData } from "@/features/Treege/Nodes/GroupNode";
import useFlow from "@/hooks/useFlow";

const GroupNodeForm = () => {
  const { updateSelectedNodeData, selectedNode } = useFlow();

  const { handleSubmit, Field } = useForm({
    defaultValues: {
      label: selectedNode?.data?.label || "",
    } as GroupNodeData,
    onSubmit: async ({ value }) => {
      updateSelectedNodeData(value);
    },
  });

  return (
    <form id="flow-node-form" onChange={handleSubmit}>
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
    </form>
  );
};

export default GroupNodeForm;
