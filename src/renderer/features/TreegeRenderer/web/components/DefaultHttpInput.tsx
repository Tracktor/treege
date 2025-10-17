import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import { InputRenderProps } from "@/renderer/types/renderer";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { getTranslatedLabel } from "@/shared/utils/label";

type HttpResponse = Record<string, unknown> | unknown[];

/**
 * Extracts a value from an object using a path like "data.users" or "results[0].name"
 */
const getValueByPath = (obj: HttpResponse, path: string): unknown => {
  if (!path) return obj;

  const parts = path.split(".");

  return parts.reduce<unknown>((current, part) => {
    if (current === null || current === undefined) return undefined;

    // Handle array indexing like "results[0]"
    const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      const [, key, index] = arrayMatch;
      const intermediate = (current as Record<string, unknown>)[key];
      if (Array.isArray(intermediate)) {
        return intermediate[Number.parseInt(index, 10)];
      }
      return intermediate;
    }

    return (current as Record<string, unknown>)[part];
  }, obj);
};

/**
 * Replaces template variables in a string with values from formValues
 * Example: "https://api.com/users/${userId}" -> "https://api.com/users/123"
 */
const replaceTemplateVars = (template: string, formValues: Record<string, unknown>): string =>
  template.replace(/\$\{(\w+)\}/g, (_, key) => String(formValues[key] || ""));

const DefaultHttpInput = ({ node }: InputRenderProps) => {
  const { formValues, setFieldValue, formErrors, language } = useTreegeRendererContext();
  const fieldId = node.id;
  const value = formValues[fieldId];
  const error = formErrors[fieldId];
  const name = node.data.name || fieldId;
  const { httpConfig } = node.data;

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [options, setOptions] = useState<Array<{ value: string; label: string }>>([]);

  const fetchData = useCallback(async () => {
    if (!httpConfig?.url) {
      setFetchError("No URL configured");
      return;
    }

    setLoading(true);
    setFetchError(null);

    try {
      // Replace template variables in URL
      const url = replaceTemplateVars(httpConfig.url, formValues);

      // Replace template variables in headers
      const headers: Record<string, string> = {};
      httpConfig.headers?.forEach((header) => {
        headers[header.key] = replaceTemplateVars(header.value, formValues);
      });

      // Replace template variables in body
      let body: string | undefined;
      if (httpConfig.body && ["POST", "PUT", "PATCH"].includes(httpConfig.method || "")) {
        body = replaceTemplateVars(httpConfig.body, formValues);
      }

      const response = await fetch(url, {
        body: body || undefined,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        method: httpConfig.method || "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: HttpResponse = await response.json();

      // Extract data using responsePath
      const extractedData = httpConfig.responsePath ? getValueByPath(data, httpConfig.responsePath) : data;

      // If responseMapping is configured, map the data to options
      if (httpConfig.responseMapping && Array.isArray(extractedData)) {
        const { valueField = "value", labelField = "label" } = httpConfig.responseMapping;

        const mappedOptions = extractedData.map((item) => ({
          label: String(getValueByPath(item as HttpResponse, labelField) || ""),
          value: String(getValueByPath(item as HttpResponse, valueField) || ""),
        }));

        setOptions(mappedOptions);
      } else {
        // Store the raw data as the field value
        setFieldValue(fieldId, extractedData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch data";
      setFetchError(errorMessage);
      console.error("HTTP Input fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [httpConfig, formValues, fieldId, setFieldValue]);

  // Fetch on mount if configured
  useEffect(() => {
    if (httpConfig?.fetchOnMount) {
      fetchData();
    }
  }, [httpConfig?.fetchOnMount, fetchData]);

  // Show loading state
  if (loading && httpConfig?.showLoading) {
    return (
      <FormItem className="mb-4">
        <Label>
          {getTranslatedLabel(node.data.label, language) || node.data.name}
          {node.data.required && <span className="text-red-500">*</span>}
        </Label>
        <div className="flex items-center gap-2 py-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
        {node.data.helperText && <FormDescription>{node.data.helperText}</FormDescription>}
      </FormItem>
    );
  }

  // Show fetch error
  if (fetchError) {
    return (
      <FormItem className="mb-4">
        <Label>
          {getTranslatedLabel(node.data.label, language) || node.data.name}
          {node.data.required && <span className="text-red-500">*</span>}
        </Label>
        <FormError>{fetchError}</FormError>
        <button type="button" onClick={fetchData} className="text-sm text-primary hover:underline">
          Retry
        </button>
      </FormItem>
    );
  }

  // If responseMapping is configured and we have options, render as select/radio/checkbox
  if (httpConfig?.responseMapping && options.length > 0) {
    // Determine the display type based on node configuration
    const displayType = node.data.type === "http" ? "select" : node.data.type;

    if (displayType === "radio") {
      return (
        <FormItem className="mb-4">
          <Label className="block text-sm font-medium mb-2">
            {getTranslatedLabel(node.data.label, language) || node.data.name}
            {node.data.required && <span className="text-red-500">*</span>}
          </Label>
          <RadioGroup value={value || ""} onValueChange={(val) => setFieldValue(fieldId, val)}>
            {options.map((opt, index) => (
              <div key={opt.value + index} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`${name}-${opt.value}`} />
                <Label htmlFor={`${name}-${opt.value}`} className="text-sm font-normal cursor-pointer">
                  {opt.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {error && <FormError>{error}</FormError>}
          {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
        </FormItem>
      );
    }

    if (displayType === "checkbox" && node.data.multiple) {
      const selectedValues = Array.isArray(value) ? value : [];

      const handleCheckboxChange = (optionValue: string, checked: boolean) => {
        const newValues = checked ? [...selectedValues, optionValue] : selectedValues.filter((v) => v !== optionValue);
        setFieldValue(fieldId, newValues);
      };

      return (
        <FormItem className="mb-4">
          <Label className="block text-sm font-medium mb-2">
            {getTranslatedLabel(node.data.label, language) || node.data.name}
            {node.data.required && <span className="text-red-500">*</span>}
          </Label>
          <div className="space-y-2">
            {options.map((opt, index) => (
              <div key={opt.value + index} className="flex items-center gap-3">
                <Checkbox
                  id={`${name}-${opt.value}`}
                  checked={selectedValues.includes(opt.value)}
                  onCheckedChange={(checked) => handleCheckboxChange(opt.value, checked as boolean)}
                />
                <Label htmlFor={`${name}-${opt.value}`} className="text-sm font-normal cursor-pointer">
                  {opt.label}
                </Label>
              </div>
            ))}
          </div>
          {error && <FormError>{error}</FormError>}
          {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
        </FormItem>
      );
    }

    // Default: render as select
    return (
      <FormItem className="mb-4">
        <Label htmlFor={name}>
          {getTranslatedLabel(node.data.label, language) || node.data.name}
          {node.data.required && <span className="text-red-500">*</span>}
        </Label>
        <Select value={value || ""} onValueChange={(val) => setFieldValue(fieldId, val)}>
          <SelectTrigger>
            <SelectValue placeholder={node.data.placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((opt, index) => (
                <SelectItem key={opt.value + index} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {error && <FormError>{error}</FormError>}
        {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
      </FormItem>
    );
  }

  // If no responseMapping, render the value as text (hidden or display-only)
  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {getTranslatedLabel(node.data.label, language) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Input type="text" id={name} name={name} value={typeof value === "string" ? value : JSON.stringify(value)} readOnly disabled />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export default DefaultHttpInput;
