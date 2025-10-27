import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { Button } from "@/shared/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/components/ui/command";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";

type HttpResponse = Record<string, unknown> | unknown[];

/**
 * Extracts a value from an object using a path like "data.users" or "results[0].name"
 */
const getValueByPath = (obj: HttpResponse, path: string): unknown => {
  if (!path) {
    return obj;
  }

  const parts = path.split(".");

  return parts.reduce<unknown>((current, part) => {
    if (current === null || current === undefined) {
      return undefined;
    }

    // Handle array indexing like "results[0]"
    const arrayMatch = part.match(/^(\w+)\[(\d+)]$/);

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
 * Example: "https://api.com/users/{{userId}}" -> "https://api.com/users/123"
 */
const replaceTemplateVars = (template: string, formValues: Record<string, unknown>): string =>
  template.replace(/{{(\w+)}}/g, (_, key) => String(formValues[key] || ""));

const DefaultHttpInput = ({ node, value, setValue, error }: InputRenderProps<"http">) => {
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [options, setOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const { formValues } = useTreegeRendererContext();
  const t = useTranslate();
  const { httpConfig } = node.data;
  const name = node.data.name || node.id;

  const fetchData = useCallback(
    async (search?: string) => {
      if (!httpConfig?.url) {
        setFetchError("No URL configured");
        return;
      }

      setLoading(true);
      setFetchError(null);

      try {
        // Replace template variables in URL and add search param if configured
        const baseUrl = replaceTemplateVars(httpConfig.url, formValues);
        const url =
          httpConfig.searchParam && search
            ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}${httpConfig.searchParam}=${encodeURIComponent(search)}`
            : baseUrl;

        // Replace template variables in headers
        const headers: Record<string, string> = {};
        httpConfig.headers?.forEach((header) => {
          headers[header.key] = replaceTemplateVars(header.value, formValues);
        });

        // Replace template variables in body (for POST/PUT/PATCH methods)
        const body =
          httpConfig.body && ["POST", "PUT", "PATCH"].includes(httpConfig.method || "")
            ? replaceTemplateVars(httpConfig.body, formValues)
            : undefined;

        const response = await fetch(url, {
          body: body || undefined,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          method: httpConfig.method || "GET",
        });

        if (!response.ok) {
          setFetchError(`HTTP ${response.status}: ${response.statusText}`);
          setLoading(false);
          return;
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
          // Store the raw data as the field value (converting to string)
          setValue(typeof extractedData === "string" ? extractedData : JSON.stringify(extractedData));
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch data";
        setFetchError(errorMessage);
        console.error("HTTP Input fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [httpConfig, formValues, setValue],
  );

  // Fetch on mount if configured
  useEffect(() => {
    if (httpConfig?.fetchOnMount) {
      void fetchData();
    }
  }, [httpConfig?.fetchOnMount, fetchData]);

  // Debounced search for combobox
  useEffect(() => {
    if (!(httpConfig?.searchParam && searchQuery)) {
      return undefined;
    }

    const timer = setTimeout(() => {
      void fetchData(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, httpConfig?.searchParam, fetchData]);

  // If responseMapping is configured
  if (httpConfig?.responseMapping) {
    const normalizedValue = Array.isArray(value) ? value[0] : value;
    const selectedOption = options.find((option) => option.value === normalizedValue);

    // Render as Combobox if searchParam is configured
    if (httpConfig.searchParam) {
      const isLoading = loading && httpConfig?.showLoading;
      const buttonContent = isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-muted-foreground">{selectedOption?.label || t(node.data.placeholder) || "Search..."}</span>
        </div>
      ) : (
        selectedOption?.label || t(node.data.placeholder) || "Search..."
      );

      return (
        <FormItem className="mb-4">
          <Label>
            {t(node.data.label) || node.data.name}
            {node.data.required && <span className="text-red-500">*</span>}
          </Label>
          <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={comboboxOpen} className="w-full justify-between">
                {buttonContent}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search..."
                  value={searchQuery}
                  onValueChange={(searchValue) => {
                    setSearchQuery(searchValue);
                    setFetchError(null); // Clear error on new search
                  }}
                />
                <CommandList>
                  {loading && (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {!loading && fetchError && (
                    <div className="p-4 text-destructive text-sm">
                      <div>{fetchError}</div>
                      <button type="button" onClick={() => fetchData(searchQuery)} className="mt-2 block text-primary hover:underline">
                        Retry
                      </button>
                    </div>
                  )}
                  {!(loading || fetchError) && (
                    <>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {options.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => {
                              setValue(option.value);
                              setComboboxOpen(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {error && <FormError>{error}</FormError>}
          {node.data.helperText && !error && <FormDescription>{t(node.data.helperText)}</FormDescription>}
        </FormItem>
      );
    }

    // Render as Select (no search)
    const isLoading = loading && httpConfig?.showLoading;

    if (options.length === 0 && !isLoading) {
      return (
        <FormItem className="mb-4">
          <Label htmlFor={name}>
            {t(node.data.label) || node.data.name}
            {node.data.required && <span className="text-red-500">*</span>}
          </Label>
          <div className="py-2 text-muted-foreground text-sm">
            No data available. Configure &#34;Fetch on mount&#34; or add a search parameter.
          </div>
          {error && <FormError>{error}</FormError>}
          {node.data.helperText && !error && <FormDescription>{t(node.data.helperText)}</FormDescription>}
        </FormItem>
      );
    }

    return (
      <FormItem className="mb-4">
        <Label htmlFor={name}>
          {t(node.data.label) || node.data.name}
          {node.data.required && <span className="text-red-500">*</span>}
        </Label>
        <Select value={Array.isArray(value) ? (value[0] ?? "") : (value ?? "")} onValueChange={(val) => setValue(val)} disabled={isLoading}>
          <SelectTrigger id={name} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <SelectValue placeholder={t(node.data.placeholder) || t("renderer.defaultHttpInput.selectOption")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((option, index) => (
                <SelectItem key={option.value + index} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {error && <FormError>{error}</FormError>}
        {node.data.helperText && !error && <FormDescription>{t(node.data.helperText)}</FormDescription>}
      </FormItem>
    );
  }

  // If no responseMapping, render the value as text (hidden or display-only)
  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {t(node.data.label) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Input type="text" id={name} name={name} value={typeof value === "string" ? value : JSON.stringify(value)} readOnly disabled />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{t(node.data.helperText)}</FormDescription>}
    </FormItem>
  );
};

export default DefaultHttpInput;
