import { useForm } from "@tanstack/react-form";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UINodeData } from "@/features/Treege/Nodes/UINode";
import useFlow from "@/hooks/useFlow";

const UINodeForm = () => {
  const { updateSelectedNodeData, selectedNode } = useFlow();

  const { handleSubmit, Field } = useForm({
    defaultValues: {
      label: selectedNode?.data?.label || "",
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
        <Field
          name="label"
          children={(field) => (
            <FormItem>
              <Label htmlFor={field.name}>Label</Label>
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
