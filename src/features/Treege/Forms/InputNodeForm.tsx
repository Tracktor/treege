import { useForm } from "@tanstack/react-form";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectInputType from "@/features/Treege/Inputs/SelectInputType";
import { InputNodeData } from "@/features/Treege/Nodes/InputNode";
import useFlow from "@/hooks/useFlow";

const InputNodeForm = () => {
  const { updateSelectedNodeData, selectedNode } = useFlow();

  const { handleSubmit, Field } = useForm({
    defaultValues: {
      helperText: selectedNode?.data?.helperText || "",
      label: selectedNode?.data?.label || "",
      name: selectedNode?.data?.name || "",
      required: selectedNode?.data?.required || false,
      type: selectedNode?.data?.type || "",
    } as InputNodeData,
    onSubmit: async ({ value }) => {
      updateSelectedNodeData(value);
    },
  });

  return (
    <form
      id="input-node-form"
      onChange={handleSubmit}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
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
          name="type"
          children={(field) => (
            <FormItem>
              <SelectInputType value={field.state.value} onValueChange={(newValue) => field.handleChange(newValue)} />
            </FormItem>
          )}
        />

        <Field
          name="name"
          children={(field) => (
            <FormItem>
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
            </FormItem>
          )}
        />

        <Field
          name="helperText"
          children={(field) => (
            <FormItem>
              <Label htmlFor={field.name}>Helper text</Label>
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
      </div>
    </form>
  );
};

export default InputNodeForm;
