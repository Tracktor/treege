import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UINodeData } from "@/features/Treege/Nodes/UINode";
import useFlow from "@/hooks/useFlow";

const UINodeForm = () => {
  const { updateSelectedNodeData, selectedNode, clearSelection } = useFlow();

  const form = useForm({
    defaultValues: {
      label: selectedNode?.data?.label || "",
      type: selectedNode?.data?.type || "",
    } as UINodeData,
    onSubmit: async ({ value }) => {
      updateSelectedNodeData(value);
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
      <div className="grid gap-6">
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
                onChange={(e) => {
                  field.handleChange(e.target.value);
                  updateSelectedNodeData({ [field.name]: e.target.value });
                }}
              />
            </div>
          )}
        />
      </div>
    </form>
  );
};

export default UINodeForm;
