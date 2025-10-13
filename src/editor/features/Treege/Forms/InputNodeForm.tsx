import { useForm } from "@tanstack/react-form";
import { ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";
import ComboboxPattern from "@/editor/features/Treege/Inputs/ComboboxPattern";
import SelectInputType from "@/editor/features/Treege/Inputs/SelectInputType";
import SelectLanguage from "@/editor/features/Treege/Inputs/SelectLanguage";
import { useAvailableParentFields } from "@/editor/hooks/useAvailableParentFields";
import useFlowActions from "@/editor/hooks/useFlowActions";
import useNodesSelection from "@/editor/hooks/useNodesSelection";
import { Button } from "@/shared/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import { FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { Language } from "@/shared/types/languages";
import { InputNodeData } from "@/shared/types/node";

const InputNodeForm = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const { selectedNode } = useNodesSelection<InputNodeData>();
  const { updateSelectedNodeData } = useFlowActions();
  const needsOptions = ["select", "radio", "autocomplete", "checkbox"].includes(selectedNode?.data?.type || "");
  const availableParentFields = useAvailableParentFields(selectedNode?.id);

  const { handleSubmit, Field } = useForm({
    defaultValues: {
      defaultValue: selectedNode?.data?.defaultValue,
      errorMessage: selectedNode?.data?.errorMessage || "",
      helperText: selectedNode?.data?.helperText || "",
      label: selectedNode?.data?.label || { en: "" },
      multiple: selectedNode?.data?.multiple || false,
      name: selectedNode?.data?.name || "",
      options: selectedNode?.data?.options || [],
      pattern: selectedNode?.data?.pattern || "",
      required: selectedNode?.data?.required || false,
      type: selectedNode?.data?.type || "",
    } as InputNodeData,
    listeners: {
      onChange: ({ formApi }) => {
        formApi.handleSubmit().then();
      },
      onChangeDebounceMs: 150,
    },
    onSubmit: async ({ value }) => {
      updateSelectedNodeData(value);
    },
  });

  return (
    <form
      id="input-node-form"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="grid gap-6">
        <div className="flex gap-2 items-end">
          <Field
            name="label"
            children={(field) => (
              <FormItem className="flex-1">
                <Label htmlFor={field.name}>Label</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value?.[selectedLanguage] || ""}
                  onBlur={field.handleBlur}
                  onChange={({ target }) => {
                    field.handleChange({
                      ...field.state.value,
                      [selectedLanguage]: target.value,
                    });
                  }}
                />
              </FormItem>
            )}
          />
          <SelectLanguage value={selectedLanguage} onValueChange={setSelectedLanguage} />
        </div>

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
                onChange={({ target }) => field.handleChange(target.value)}
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

        {/* Options */}
        {needsOptions && (
          <Collapsible defaultOpen className="flex w-full max-w-[350px] flex-col gap-2">
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between gap-4">
                <h4 className="text-sm font-semibold">Options</h4>
                <Button variant="ghost" size="icon" className="size-8">
                  <ChevronsUpDown />
                  <span className="sr-only">Toggle</span>
                </Button>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="flex flex-col gap-4">
              <Field name="options" mode="array">
                {(field) => (
                  <div className="space-y-2">
                    {field.state.value?.map((_, index) => {
                      const key = `options[${index}]`;

                      return (
                        <div key={key} className="flex gap-2 items-start">
                          {/* Label field */}
                          <Field name={`options[${index}].label`}>
                            {(subField) => (
                              <Input
                                placeholder="Label"
                                value={subField.state.value?.[selectedLanguage] || ""}
                                onChange={({ target }) => {
                                  subField.handleChange({
                                    ...subField.state.value,
                                    [selectedLanguage]: target.value,
                                  });
                                }}
                              />
                            )}
                          </Field>

                          {/* Value field */}
                          <Field name={`options[${index}].value`}>
                            {(subField) => (
                              <Input
                                placeholder="Value"
                                value={subField.state.value || ""}
                                onChange={({ target }) => subField.handleChange(target.value)}
                              />
                            )}
                          </Field>

                          {/* Remove button */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              field.removeValue(index);
                              handleSubmit().then();
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}

                    {/* Add option button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        field.pushValue({ label: { en: "" }, value: "" });
                        handleSubmit().then();
                      }}
                    >
                      + Add option
                    </Button>
                  </div>
                )}
              </Field>

              {/* Multiple selection switch */}
              {selectedNode?.data?.type === "select" && (
                <Field
                  name="multiple"
                  children={(field) => (
                    <div className="flex items-center space-x-2">
                      <Switch id="multiple" checked={field.state.value} onCheckedChange={(newValue) => field.handleChange(newValue)} />
                      <Label htmlFor="multiple">Multiple selection</Label>
                    </div>
                  )}
                />
              )}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Validation */}
        <Collapsible className="flex w-full max-w-[350px] flex-col gap-2">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-sm font-semibold">Validation</h4>
              <Button variant="ghost" size="icon" className="size-8">
                <ChevronsUpDown />
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
                    <Label htmlFor="required">Required</Label>
                  </div>
                </FormItem>
              )}
            />

            <Field
              name="pattern"
              children={(field) => (
                <FormItem>
                  <Label htmlFor={field.name}>Pattern</Label>
                  <ComboboxPattern value={field.state.value} onValueChange={field.handleChange} />
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

        <Collapsible className="flex w-full max-w-[350px] flex-col gap-2">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-sm font-semibold">Advanced Configuration</h4>
              <Button variant="ghost" size="icon" className="size-8">
                <ChevronsUpDown />
                <span className="sr-only">Toggle</span>
              </Button>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="flex flex-col gap-6">
            <Field name="defaultValue">
              {(defaultValueField) => (
                <>
                  <FormItem>
                    <Label htmlFor="defaultValueType">Default Value</Label>
                    <Select
                      value={defaultValueField.state.value?.type || "none"}
                      onValueChange={(value: "none" | "static" | "reference") => {
                        defaultValueField.handleChange(value === "none" ? null : { type: value });
                      }}
                    >
                      <SelectTrigger id="defaultValueType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="static">Static Value</SelectItem>
                        <SelectItem value="reference">Reference Field</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>

                  {defaultValueField.state.value?.type === "static" && (
                    <Field name="defaultValue.staticValue">
                      {(field) => {
                        const inputType = selectedNode?.data?.type;

                        if (inputType === "checkbox") {
                          return (
                            <FormItem>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="staticValue"
                                  checked={!!field.state.value}
                                  onCheckedChange={(value: boolean) => field.handleChange(value)}
                                />
                                <Label htmlFor="staticValue">Default Checked</Label>
                              </div>
                            </FormItem>
                          );
                        }

                        if (inputType === "select" && selectedNode?.data?.multiple) {
                          return (
                            <FormItem>
                              <Label htmlFor="staticValue">Default Values (comma-separated)</Label>
                              <Input
                                id="staticValue"
                                placeholder="value1, value2, value3"
                                value={Array.isArray(field.state.value) ? field.state.value.join(", ") : ""}
                                onChange={({ target }) => {
                                  const values = target.value
                                    .split(",")
                                    .map((v: string) => v.trim())
                                    .filter(Boolean);
                                  field.handleChange(values.length > 0 ? values : undefined);
                                }}
                              />
                            </FormItem>
                          );
                        }

                        return (
                          <FormItem>
                            <Label htmlFor="staticValue">Static Value</Label>
                            <Input
                              id="staticValue"
                              placeholder="Enter default value"
                              value={typeof field.state.value === "string" ? field.state.value : ""}
                              onChange={({ target }) => field.handleChange(target.value || undefined)}
                            />
                          </FormItem>
                        );
                      }}
                    </Field>
                  )}

                  {defaultValueField.state.value?.type === "reference" && (
                    <>
                      <Field name="defaultValue.referenceField">
                        {(field: any) => (
                          <FormItem>
                            <Label htmlFor="referenceField">Reference Field</Label>
                            <Select
                              value={field.state.value || ""}
                              onValueChange={(value: string) => {
                                field.handleChange(value || undefined);
                              }}
                            >
                              <SelectTrigger id="referenceField">
                                <SelectValue placeholder="Select a field" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableParentFields.length === 0 ? (
                                  <SelectItem value="none" disabled>
                                    No parent fields available
                                  </SelectItem>
                                ) : (
                                  availableParentFields.map((availField) => (
                                    <SelectItem key={availField.nodeId} value={availField.nodeId}>
                                      {availField.label} ({availField.type})
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            {availableParentFields.length === 0 && (
                              <p className="text-xs text-muted-foreground mt-1">Add input fields before this node to reference them</p>
                            )}
                          </FormItem>
                        )}
                      </Field>

                      <Field name="defaultValue.transformFunction">
                        {(field) => (
                          <FormItem>
                            <Label htmlFor="transformFunction">Transform Function</Label>
                            <Select
                              value={field.state.value || "none"}
                              onValueChange={(value: "none" | "toString" | "toNumber" | "toBoolean" | "toArray") => {
                                field.handleChange(value === "none" ? null : value);
                              }}
                            >
                              <SelectTrigger id="transformFunction">
                                <SelectValue placeholder="Select transformation" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No transformation</SelectItem>
                                <SelectItem value="toString">Convert to String</SelectItem>
                                <SelectItem value="toNumber">Convert to Number</SelectItem>
                                <SelectItem value="toBoolean">Convert to Boolean</SelectItem>
                                <SelectItem value="toArray">Convert to Array</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground mt-1">
                              Transform the referenced value to match this field&#39;s type
                            </p>
                          </FormItem>
                        )}
                      </Field>
                    </>
                  )}
                </>
              )}
            </Field>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </form>
  );
};

export default InputNodeForm;
