import { useForm } from "@tanstack/react-form";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import SelectInputType from "@/features/Treege/Inputs/SelectInputType";
import { InputNodeData } from "@/features/Treege/Nodes/InputNode";
import useFlow from "@/hooks/useFlow";

const InputNodeForm = () => {
  const [validationSectionIsOpen, setValidationSectionIsOpen] = useState(false);
  const { updateSelectedNodeData, selectedNode } = useFlow();

  const { handleSubmit, Field } = useForm({
    defaultValues: {
      errorMessage: selectedNode?.data?.errorMessage || "",
      helperText: selectedNode?.data?.helperText || "",
      label: selectedNode?.data?.label || "",
      name: selectedNode?.data?.name || "",
      pattern: selectedNode?.data?.pattern || "",
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

        {/* Validation */}
        <Collapsible open={validationSectionIsOpen} onOpenChange={setValidationSectionIsOpen} className="flex w-[350px] flex-col gap-2">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-sm font-semibold">Validation</h4>
              <Button variant="ghost" size="icon" className="size-8">
                {validationSectionIsOpen ? <ChevronDown className="rotate-180" /> : <ChevronDown />}
                <span className="sr-only">Toggle</span>
              </Button>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="flex flex-col gap-6">
            <Field
              name="required"
              children={(field) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <Switch id="required" checked={field.state.value} onCheckedChange={(newValue) => field.handleChange(newValue)} />
                    <Label htmlFor="airplane-mode">Required</Label>
                  </div>
                </FormItem>
              )}
            />

            <Field
              name="pattern"
              children={(field) => (
                <FormItem>
                  <Label htmlFor={field.name}>Pattern</Label>
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
              name="errorMessage"
              children={(field) => (
                <FormItem>
                  <Label htmlFor={field.name}>Error message</Label>
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
          </CollapsibleContent>
        </Collapsible>
      </div>
    </form>
  );
};

export default InputNodeForm;
