import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputNodeType } from "@/features/Treege/Nodes/InputNode";
import useFlow from "@/hooks/useFlow";

const NodeForm = () => {
  const { updateSelectedNode, selectedNode, clearSelection } = useFlow();

  const form = useForm({
    defaultValues: {
      label: selectedNode?.data?.label || "",
      name: selectedNode?.data?.name || "",
    } as InputNodeType["data"],
    onSubmit: async ({ value }) => {
      updateSelectedNode(value);
      clearSelection();
    },
  });

  return (
    <form
      id="edit-node-form"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit().then();
      }}
    >
      <div className="grid gap-6 px-4">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="input">Input</SelectItem>
              <SelectItem value="ui">UI</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

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
                  updateSelectedNode({ [field.name]: e.target.value });
                }}
              />
            </div>
          )}
        />

        <form.Field
          name="name"
          children={(field) => (
            <div className="grid gap-3">
              <Label htmlFor={field.name}>Name *</Label>
              <Input
                required
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                  updateSelectedNode({ [field.name]: e.target.value });
                }}
              />
            </div>
          )}
        />
      </div>
    </form>
  );
};

export default NodeForm;
