import { useForm } from "@tanstack/react-form";
import { Plus, Variable, X } from "lucide-react";
import { useAvailableParentFields } from "@/editor/hooks/useAvailableParentFields";
import useNodesSelection from "@/editor/hooks/useNodesSelection";
import { Button } from "@/shared/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { FormDescription, FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";
import { HttpConfig, InputNodeData } from "@/shared/types/node";

interface HttpConfigFormProps {
  value: HttpConfig | undefined;
  onChange: (config: HttpConfig | undefined) => void;
}

const HttpConfigForm = ({ value, onChange }: HttpConfigFormProps) => {
  const { selectedNode } = useNodesSelection<InputNodeData>();
  const availableParentFields = useAvailableParentFields(selectedNode?.id);

  const { handleSubmit, Field } = useForm({
    defaultValues: {
      body: value?.body || "",
      fetchOnMount: value?.fetchOnMount || false,
      headers: value?.headers || [],
      method: value?.method || "GET",
      responseMapping: value?.responseMapping || {
        labelField: "",
        valueField: "",
      },
      responsePath: value?.responsePath || "",
      searchParam: value?.searchParam || "",
      showLoading: value?.showLoading !== false,
      url: value?.url || "",
    } as HttpConfig,
    listeners: {
      onChange: ({ formApi }) => {
        formApi.handleSubmit().then();
      },
      onChangeDebounceMs: 150,
    },
    onSubmit: async ({ value: formValue }) => {
      onChange(formValue);
    },
  });

  const needsBody = ["POST", "PUT", "PATCH"].includes(value?.method || "");

  return (
    <form
      id="http-config-form"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="grid gap-6">
        <Field
          name="url"
          children={(field) => (
            <FormItem>
              <Label htmlFor={field.name}>API URL</Label>
              <div className="flex gap-2">
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={({ target }) => field.handleChange(target.value)}
                  placeholder="https://api.example.com/data"
                  className="flex-1"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline" size="icon">
                      <Variable className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {availableParentFields.length === 0 ? (
                      <DropdownMenuItem disabled>No fields available</DropdownMenuItem>
                    ) : (
                      availableParentFields.map((availField) => (
                        <DropdownMenuItem
                          key={availField.nodeId}
                          onClick={() => {
                            const variable = `\${${availField.nodeId}}`;
                            const currentValue = field.state.value || "";
                            field.handleChange(currentValue + variable);
                            handleSubmit().then();
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{availField.label}</span>
                            <span className="text-xs text-muted-foreground">{`\${${availField.nodeId}}`}</span>
                          </div>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <FormDescription>Use template variables like ${"{fieldId}"} to reference other fields</FormDescription>
            </FormItem>
          )}
        />

        <Field
          name="method"
          children={(field) => (
            <FormItem>
              <Label htmlFor={field.name}>HTTP Method</Label>
              <Select
                value={field.state.value}
                onValueChange={(newValue: "GET" | "POST" | "PUT" | "DELETE" | "PATCH") => field.handleChange(newValue)}
              >
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Headers</h4>
          <Field name="headers" mode="array">
            {(field) => (
              <div className="space-y-2">
                {field.state.value?.map((_, index) => {
                  const key = `headers[${index}]`;

                  return (
                    <div key={key} className="flex gap-2 items-start">
                      <Field name={`headers[${index}].key`}>
                        {(subField) => (
                          <Input
                            placeholder="Header name"
                            value={subField.state.value || ""}
                            onChange={({ target }) => subField.handleChange(target.value)}
                          />
                        )}
                      </Field>

                      <Field name={`headers[${index}].value`}>
                        {(subField) => (
                          <Input
                            placeholder="Header value"
                            value={subField.state.value || ""}
                            onChange={({ target }) => subField.handleChange(target.value)}
                          />
                        )}
                      </Field>

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

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    field.pushValue({ key: "", value: "" });
                    handleSubmit().then();
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add header
                </Button>
              </div>
            )}
          </Field>
        </div>

        {needsBody && (
          <Field
            name="body"
            children={(field) => (
              <FormItem>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor={field.name}>Request Body (JSON)</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="ghost" size="sm">
                        <Variable className="h-4 w-4 mr-2" />
                        Insert variable
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {availableParentFields.length === 0 ? (
                        <DropdownMenuItem disabled>No fields available</DropdownMenuItem>
                      ) : (
                        availableParentFields.map((availField) => (
                          <DropdownMenuItem
                            key={availField.nodeId}
                            onClick={() => {
                              const variable = `\${${availField.nodeId}}`;
                              const currentValue = field.state.value || "";
                              field.handleChange(currentValue + variable);
                              handleSubmit().then();
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{availField.label}</span>
                              <span className="text-xs text-muted-foreground">{`\${${availField.nodeId}}`}</span>
                            </div>
                          </DropdownMenuItem>
                        ))
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={({ target }) => field.handleChange(target.value)}
                  placeholder='{"key": "value"}'
                  rows={4}
                />
                <FormDescription>Use template variables like ${"{fieldId}"} to reference other fields</FormDescription>
              </FormItem>
            )}
          />
        )}

        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Response Configuration</h4>

          <Field
            name="responsePath"
            children={(field) => (
              <FormItem>
                <Label htmlFor={field.name}>Response Path</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={({ target }) => field.handleChange(target.value)}
                  placeholder="data.users or results[0]"
                />
                <FormDescription>Extract data from response using dot notation or array indexing</FormDescription>
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <h5 className="text-sm font-medium">Map to Options</h5>

            <Field
              name="responseMapping.valueField"
              children={(field) => (
                <FormItem>
                  <Label htmlFor={field.name}>Value Field</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={({ target }) => field.handleChange(target.value)}
                    placeholder="id"
                  />
                  <FormDescription>Field to use as option value (e.g., id)</FormDescription>
                </FormItem>
              )}
            />

            <Field
              name="responseMapping.labelField"
              children={(field) => (
                <FormItem>
                  <Label htmlFor={field.name}>Label Field</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={({ target }) => field.handleChange(target.value)}
                    placeholder="name"
                  />
                  <FormDescription>Field to use as option label (e.g., name)</FormDescription>
                </FormItem>
              )}
            />
          </div>

          <Field
            name="searchParam"
            children={(field) => (
              <FormItem>
                <Label htmlFor={field.name}>Search Parameter (optional)</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={({ target }) => field.handleChange(target.value)}
                  placeholder="q, search, query..."
                />
                <FormDescription>If set, enables combobox with search that adds this param to API calls (e.g., ?q=Paris)</FormDescription>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Behavior</h4>

          <Field
            name="fetchOnMount"
            children={(field) => (
              <div className="flex items-center space-x-2">
                <Switch id="fetchOnMount" checked={field.state.value} onCheckedChange={(newValue) => field.handleChange(newValue)} />
                <Label htmlFor="fetchOnMount">Fetch on mount</Label>
              </div>
            )}
          />

          <Field
            name="showLoading"
            children={(field) => (
              <div className="flex items-center space-x-2">
                <Switch id="showLoading" checked={field.state.value} onCheckedChange={(newValue) => field.handleChange(newValue)} />
                <Label htmlFor="showLoading">Show loading state</Label>
              </div>
            )}
          />
        </div>
      </div>
    </form>
  );
};

export default HttpConfigForm;
