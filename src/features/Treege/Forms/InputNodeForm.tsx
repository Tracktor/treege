import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectInputType from "@/features/Treege/Inputs/SelectInputType";
import { InputNodeData } from "@/features/Treege/Nodes/InputNode";
import useFlow from "@/hooks/useFlow";

const InputNodeForm = () => {
  const { updateSelectedNodeData, selectedNode } = useFlow();

  const { handleSubmit, Field } = useForm({
    defaultValues: {
      label: selectedNode?.data?.label || "",
      name: selectedNode?.data?.name || "",
      type: selectedNode?.data?.type || "",
    } as InputNodeData,
    onSubmit: async ({ value }) => {
      updateSelectedNodeData(value);
    },
  });

  return (
    <form id="inout-node-form" onChange={handleSubmit}>
      <div className="grid gap-6">
        <SelectInputType />

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
          name="name"
          children={(field) => (
            <div className="grid gap-3">
              <Label htmlFor={field.name}>Name</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={({ target }) => {
                  field.handleChange(target.value);
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
