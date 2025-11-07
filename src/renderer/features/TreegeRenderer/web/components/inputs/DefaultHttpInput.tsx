import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { convertFormValuesToNamedFormat } from "@/renderer/utils/form";
import { getFieldNameFromNodeId } from "@/renderer/utils/node";
import { Button } from "@/shared/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/components/ui/command";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";
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
 * Extracts variable names from a template string
 * Example: "https://api.com/users/{{userId}}/posts/{{postId}}" -> ["userId", "postId"]
 * Supports alphanumeric characters, underscores, and hyphens in variable names
 */
const extractTemplateVars = (template: string): string[] => {
  const matches = template.matchAll(/{{([\w-]+)}}/g);
  return Array.from(matches, (match) => match[1]);
};

/**
 * Checks if all template variables in a string have non-empty values
 * Returns true if all variables are filled, false otherwise
 */
const areTemplateVarsFilled = (template: string, formValues: Record<string, unknown>): boolean => {
  const vars = extractTemplateVars(template);
  return vars.every((varName) => {
    const value = formValues[varName];
    return value !== undefined && value !== null && value !== "";
  });
};

/**
 * Replaces template variables in a string with values from formValues
 * Example: "https://api.com/users/{{userId}}" -> "https://api.com/users/123"
 * Supports alphanumeric characters, underscores, and hyphens in variable names
 */
const replaceTemplateVars = (template: string, formValues: Record<string, unknown>, encode = false): string =>
  template.replace(/{{([\w-]+)}}/g, (_, key) => {
    const value = String(formValues[key] || "");
    return encode ? encodeURIComponent(value) : value;
  });

const DefaultHttpInput = ({ node, value, setValue, error, label, placeholder, helperText, id, name }: InputRenderProps<"http">) => {
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [options, setOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const { formValues, inputNodes } = useTreegeRendererContext();
  const t = useTranslate();
  const { httpConfig } = node.data;
  const hasFetchedOnMount = useRef(false);
  const lastFetchedTemplateValues = useRef<string>("");

  // Refs to store latest values without triggering re-renders
  const httpConfigRef = useRef(httpConfig);
  const formValuesRef = useRef(formValues);
  const inputNodesRef = useRef(inputNodes);
  const setValueRef = useRef(setValue);
  const fetchDataRef = useRef<((search?: string) => Promise<void>) | null>(null);

  /**
   * Extract template variables from URL (memoized)
   */
  const templateVars = useMemo(() => {
    if (!httpConfig?.url) {
      return [];
    }
    return extractTemplateVars(httpConfig.url);
  }, [httpConfig?.url]);

  /**
   * Check if URL has template variables
   */
  const hasTemplateVars = templateVars.length > 0;

  /**
   * Get current values of template variables (for dependency tracking)
   * Returns a stable string key that only changes when the actual template variable values change
   */
  const templateVarValuesKey = useMemo(() => {
    return templateVars.map((varName) => `${varName}:${String(formValues[varName] ?? "")}`).join("|");
  }, [templateVars, formValues]);

  /**
   * Check if we can make a fetch request
   * Returns true only if URL exists and all template variables are filled
   */
  const canFetch = useMemo(() => {
    if (!httpConfig?.url) {
      return false;
    }
    // If no template vars, we can always fetch
    if (!hasTemplateVars) {
      return true;
    }
    // If has template vars, check they're all filled
    return areTemplateVarsFilled(httpConfig.url, formValues);
  }, [httpConfig?.url, hasTemplateVars, formValues]);

  const fetchData = useCallback(
    async (search?: string) => {
      const currentHttpConfig = httpConfigRef.current;
      const currentFormValues = formValuesRef.current;
      const currentSetValue = setValueRef.current;

      if (!currentHttpConfig?.url) {
        setFetchError(t("renderer.defaultHttpInput.noUrlConfigured"));
        return;
      }

      // Check if we can fetch (all template vars filled)
      if (currentHttpConfig.url && !areTemplateVarsFilled(currentHttpConfig.url, currentFormValues)) {
        return;
      }

      setLoading(true);
      setFetchError(null);

      try {
        // Replace template variables in URL and add search param if configured
        const baseUrl = replaceTemplateVars(currentHttpConfig.url, currentFormValues, true);

        const url =
          currentHttpConfig.searchParam && search
            ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}${currentHttpConfig.searchParam}=${encodeURIComponent(search)}`
            : baseUrl;

        // Replace template variables in headers
        const headers: Record<string, string> = {};
        currentHttpConfig.headers?.forEach((header) => {
          headers[header.key] = replaceTemplateVars(header.value, currentFormValues);
        });

        // Prepare body: use all form data if sendFormData is true, otherwise use custom body
        const body = ["POST", "PUT", "PATCH"].includes(currentHttpConfig.method || "")
          ? currentHttpConfig.sendFormData
            ? JSON.stringify(convertFormValuesToNamedFormat(currentFormValues, inputNodesRef.current))
            : currentHttpConfig.body
              ? replaceTemplateVars(currentHttpConfig.body, currentFormValues)
              : undefined
          : undefined;

        const response = await fetch(url, {
          body: body || undefined,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          method: currentHttpConfig.method || "GET",
        });

        if (!response.ok) {
          setFetchError(`HTTP ${response.status}: ${response.statusText}`);
          setLoading(false);
          return;
        }

        const data: HttpResponse = await response.json();

        // Extract data using responsePath
        const extractedData = currentHttpConfig.responsePath ? getValueByPath(data, currentHttpConfig.responsePath) : data;

        // If responseMapping is configured, map the data to options
        if (currentHttpConfig.responseMapping && Array.isArray(extractedData)) {
          const { valueField = "value", labelField = "label" } = currentHttpConfig.responseMapping;

          const mappedOptions = extractedData.map((item) => ({
            label: String(getValueByPath(item as HttpResponse, labelField) || ""),
            value: String(getValueByPath(item as HttpResponse, valueField) || ""),
          }));

          setOptions(mappedOptions);
        } else {
          // Store the raw data as the field value (converting to string)
          currentSetValue(typeof extractedData === "string" ? extractedData : JSON.stringify(extractedData));
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t("renderer.defaultHttpInput.fetchFailed");
        setFetchError(errorMessage);
        console.error("HTTP Input fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [t],
  );

  /**
   * Update refs
   */
  useEffect(() => {
    httpConfigRef.current = httpConfig;
    formValuesRef.current = formValues;
    inputNodesRef.current = inputNodes;
    setValueRef.current = setValue;
    fetchDataRef.current = fetchData;
  }, [httpConfig, formValues, inputNodes, setValue, fetchData]);

  /**
   * Effect 1: Fetch on mount if fetchOnMount is true AND all variables are filled
   * Only runs once at initial mount
   */
  useEffect(() => {
    // Mark that we've processed the initial mount
    if (hasFetchedOnMount.current) {
      return;
    }

    hasFetchedOnMount.current = true;

    // Check conditions using refs to get current values
    const currentHttpConfig = httpConfigRef.current;
    const currentFormValues = formValuesRef.current;
    const currentFetchData = fetchDataRef.current;

    // Only fetch if conditions are met
    const canFetchNow = currentHttpConfig?.url && areTemplateVarsFilled(currentHttpConfig.url, currentFormValues);

    if (currentHttpConfig?.fetchOnMount && canFetchNow && currentFetchData) {
      void currentFetchData();
      // Store the current template values
      if (currentHttpConfig.url) {
        const currentTemplateVars = extractTemplateVars(currentHttpConfig.url);
        lastFetchedTemplateValues.current = currentTemplateVars
          .map((varName) => `${varName}:${String(currentFormValues[varName] ?? "")}`)
          .join("|");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  /**
   * Effect 2: Watch template variables and refetch when they change (debounced)
   * Only runs AFTER initial mount if there are template variables
   */
  useEffect(() => {
    // Skip if we haven't done the initial mount fetch yet
    if (!hasFetchedOnMount.current) {
      return;
    }

    // Only watch if URL has template variables
    if (!hasTemplateVars) {
      return;
    }

    // Skip if template values haven't changed
    if (lastFetchedTemplateValues.current === templateVarValuesKey) {
      return;
    }

    // Skip if we can't fetch yet
    if (!canFetch) {
      return;
    }

    // Debounce to avoid multiple calls when user is typing
    const timer = setTimeout(() => {
      void fetchData();
      lastFetchedTemplateValues.current = templateVarValuesKey;
    }, 500);

    return () => clearTimeout(timer);
  }, [templateVarValuesKey, hasTemplateVars, canFetch, fetchData]);

  /**
   * Effect 3: Debounced search for combobox
   */
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
          <span className="text-muted-foreground">{selectedOption?.label || placeholder || t("renderer.defaultHttpInput.search")}</span>
        </div>
      ) : (
        selectedOption?.label || placeholder || t("renderer.defaultHttpInput.search")
      );

      return (
        <FormItem className="mb-4">
          <Label>
            {label || node.data.name}
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
                  placeholder={t("renderer.defaultHttpInput.search")}
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
                        {t("renderer.defaultHttpInput.retry")}
                      </button>
                    </div>
                  )}
                  {!(loading || fetchError) && (
                    <>
                      <CommandEmpty>{t("renderer.defaultHttpInput.noResults")}</CommandEmpty>
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
          {helperText && !error && <FormDescription>{helperText}</FormDescription>}
        </FormItem>
      );
    }

    // Render as Select (no search)
    const isLoading = loading && httpConfig?.showLoading;

    // Build tooltip message for disabled state
    const emptyVars = templateVars.filter((varName) => {
      const value = formValues[varName];
      return value === undefined || value === null || value === "";
    });

    // Map empty var IDs to human-readable names
    const emptyVarNames = emptyVars.map((varName) => getFieldNameFromNodeId(varName, inputNodes) || varName);

    const tooltipMessage =
      options.length === 0 && !isLoading
        ? emptyVars.length > 0
          ? `${t("renderer.defaultHttpInput.waitingForRequiredFields")}: ${emptyVarNames.join(", ")}`
          : t("renderer.defaultHttpInput.noDataAvailable")
        : undefined;

    const selectElement = (
      <Select
        value={Array.isArray(value) ? (value[0] ?? "") : (value ?? "")}
        onValueChange={(val) => setValue(val)}
        disabled={isLoading || options.length === 0}
        name={name}
      >
        <SelectTrigger id={id} name={name} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <SelectValue placeholder={placeholder || t("renderer.defaultHttpInput.selectOption")} />
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
    );

    return (
      <FormItem className="mb-4">
        <Label htmlFor={id}>
          {label || node.data.name}
          {node.data.required && <span className="text-red-500">*</span>}
        </Label>
        {tooltipMessage ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">{selectElement}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipMessage}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          selectElement
        )}
        {error && <FormError>{error}</FormError>}
        {helperText && !error && <FormDescription>{helperText}</FormDescription>}
      </FormItem>
    );
  }

  // If no responseMapping, render the value as text (hidden or display-only)
  return (
    <FormItem className="mb-4">
      <Label htmlFor={id}>
        {label || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Input type="text" name={name} id={id} value={typeof value === "string" ? value : JSON.stringify(value)} readOnly disabled />
      {error && <FormError>{error}</FormError>}
      {helperText && !error && <FormDescription>{helperText}</FormDescription>}
    </FormItem>
  );
};

export default DefaultHttpInput;
