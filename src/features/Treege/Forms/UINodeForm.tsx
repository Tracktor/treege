import { useForm } from "@tanstack/react-form";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UINodeData } from "@/features/Treege/Nodes/UINode";
import useFlow from "@/hooks/useFlow";

const UINodeForm = () => {
  const { updateSelectedNodeData, selectedNode } = useFlow();

  const { handleSubmit, Field } = useForm({
    defaultValues: {
      type: selectedNode?.data?.type || "",
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
        <Field
          name="type"
          children={(field) => (
            <FormItem>
              <Label htmlFor={field.name}>Type</Label>
              <Input
                required
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={({ target }) => field.handleChange(target.value)}
              />
            </FormItem>
          )}
        />
      </div>
    </form>
  );
};

export default UINodeForm;
