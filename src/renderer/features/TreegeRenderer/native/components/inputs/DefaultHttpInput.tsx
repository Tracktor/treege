import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { convertFormValuesToNamedFormat } from "@/renderer/utils/form";
import { getFieldNameFromNodeId } from "@/renderer/utils/node";
import { sanitizeHttpResponse } from "@/renderer/utils/sanitize.native";

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
 */
const extractTemplateVars = (template: string): string[] => {
  const matches = template.matchAll(/{{([\w-]+)}}/g);
  return Array.from(matches, (match) => match[1]);
};

/**
 * Checks if all template variables in a string have non-empty values
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
 */
const replaceTemplateVars = (template: string, formValues: Record<string, unknown>, encode = false): string =>
  template.replace(/{{([\w-]+)}}/g, (_, key) => {
    const value = String(formValues[key] || "");
    return encode ? encodeURIComponent(value) : value;
  });

const DefaultHttpInput = ({
  node,
  value,
  setValue,
  error,
  label,
  placeholder,
  helperText,
  id: _id,
  name: _name,
}: InputRenderProps<"http">) => {
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [options, setOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
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
   */
  const templateVarValuesKey = useMemo(() => {
    return templateVars.map((varName) => `${varName}:${String(formValues[varName] ?? "")}`).join("|");
  }, [templateVars, formValues]);

  /**
   * Check if we can make a fetch request
   */
  const canFetch = useMemo(() => {
    if (!httpConfig?.url) {
      return false;
    }
    if (!hasTemplateVars) {
      return true;
    }
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

        // Prepare body
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
          setFetchError(`HTTP Error ${response.status}: ${response.statusText}`);
          setLoading(false);
          return;
        }

        const data: HttpResponse = await response.json();

        // Sanitize the response data
        const sanitizedData = sanitizeHttpResponse(data) as HttpResponse;

        // Extract data using responsePath
        const extractedData = currentHttpConfig.responsePath
          ? getValueByPath(sanitizedData, currentHttpConfig.responsePath)
          : sanitizedData;

        // If responseMapping is configured, map the data to options
        if (currentHttpConfig.responseMapping && Array.isArray(extractedData)) {
          const { valueField = "value", labelField = "label" } = currentHttpConfig.responseMapping;

          const mappedOptions = extractedData.map((item) => ({
            label: String(getValueByPath(item as HttpResponse, labelField) || ""),
            value: String(getValueByPath(item as HttpResponse, valueField) || ""),
          }));

          setOptions(mappedOptions);
        } else {
          // Store the raw data as the field value
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
   * Effect 1: Fetch on mount if fetchOnMount is true
   */
  useEffect(() => {
    if (hasFetchedOnMount.current) {
      return;
    }

    hasFetchedOnMount.current = true;

    const currentHttpConfig = httpConfigRef.current;
    const currentFormValues = formValuesRef.current;
    const currentFetchData = fetchDataRef.current;

    const canFetchNow = currentHttpConfig?.url && areTemplateVarsFilled(currentHttpConfig.url, currentFormValues);

    if (currentHttpConfig?.fetchOnMount && canFetchNow && currentFetchData) {
      void currentFetchData();
      if (currentHttpConfig.url) {
        const currentTemplateVars = extractTemplateVars(currentHttpConfig.url);
        lastFetchedTemplateValues.current = currentTemplateVars
          .map((varName) => `${varName}:${String(currentFormValues[varName] ?? "")}`)
          .join("|");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Effect 2: Watch template variables and refetch when they change (debounced)
   */
  useEffect(() => {
    if (!hasFetchedOnMount.current) {
      return;
    }

    if (!hasTemplateVars) {
      return;
    }

    if (lastFetchedTemplateValues.current === templateVarValuesKey) {
      return;
    }

    if (!canFetch) {
      return;
    }

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

      return (
        <View style={styles.container}>
          <Text style={styles.label}>
            {label || node.data.name}
            {node.data.required && <Text style={styles.required}>*</Text>}
          </Text>

          <TouchableOpacity style={[styles.trigger, error && styles.triggerError]} onPress={() => setModalOpen(true)} activeOpacity={0.7}>
            {isLoading ? (
              <View style={styles.loadingTrigger}>
                <ActivityIndicator size="small" color="#3B82F6" />
                <Text style={styles.triggerPlaceholder}>
                  {selectedOption?.label || placeholder || t("renderer.defaultHttpInput.search")}
                </Text>
              </View>
            ) : (
              <Text style={[styles.triggerText, !selectedOption && styles.triggerPlaceholder]}>
                {selectedOption?.label || placeholder || t("renderer.defaultHttpInput.search")}
              </Text>
            )}
            <Text style={styles.arrow}>▼</Text>
          </TouchableOpacity>

          <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalOpen(false)}>
              <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{label || node.data.name}</Text>
                  <TouchableOpacity onPress={() => setModalOpen(false)}>
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder={t("renderer.defaultHttpInput.search")}
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={(text) => {
                      setSearchQuery(text);
                      setFetchError(null);
                    }}
                    autoFocus
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#3B82F6" />
                  </View>
                ) : fetchError ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{fetchError}</Text>
                    <TouchableOpacity onPress={() => fetchData(searchQuery)} style={styles.retryButton}>
                      <Text style={styles.retryButtonText}>{t("renderer.defaultHttpInput.retry")}</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <FlatList
                    data={options}
                    keyExtractor={(item) => item.value}
                    style={styles.optionsList}
                    contentContainerStyle={styles.optionsListContent}
                    ListEmptyComponent={
                      <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>{t("renderer.defaultHttpInput.noResults")}</Text>
                      </View>
                    }
                    renderItem={({ item }) => {
                      const isSelected = item.value === normalizedValue;

                      return (
                        <TouchableOpacity
                          style={[styles.option, isSelected && styles.optionSelected]}
                          onPress={() => {
                            setValue(item.value);
                            setModalOpen(false);
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.optionText}>{item.label}</Text>
                          {isSelected && <Text style={styles.checkmark}>✓</Text>}
                        </TouchableOpacity>
                      );
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
          </Modal>

          {error && <Text style={styles.error}>{error}</Text>}
          {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
        </View>
      );
    }

    // Render as Select (no search)
    const isLoading = loading && httpConfig?.showLoading;

    // Build tooltip/helper message for disabled state
    const emptyVars = templateVars.filter((varName) => {
      const value = formValues[varName];
      return value === undefined || value === null || value === "";
    });

    const emptyVarNames = emptyVars.map((varName) => getFieldNameFromNodeId(varName, inputNodes) || varName);

    const disabledMessage =
      options.length === 0 && !isLoading
        ? fetchError
          ? fetchError
          : emptyVars.length > 0
            ? `${t("renderer.defaultHttpInput.waitingForRequiredFields")}: ${emptyVarNames.join(", ")}`
            : t("renderer.defaultHttpInput.noDataAvailable")
        : undefined;

    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {label || node.data.name}
          {node.data.required && <Text style={styles.required}>*</Text>}
        </Text>

        <TouchableOpacity
          style={[styles.trigger, error && styles.triggerError, (isLoading || options.length === 0) && styles.triggerDisabled]}
          onPress={() => setModalOpen(true)}
          disabled={isLoading || options.length === 0}
          activeOpacity={0.7}
        >
          {isLoading && <ActivityIndicator size="small" color="#3B82F6" style={styles.triggerLoader} />}
          <Text style={[styles.triggerText, !selectedOption && styles.triggerPlaceholder]}>
            {selectedOption?.label || placeholder || t("renderer.defaultHttpInput.selectOption")}
          </Text>
          <Text style={styles.arrow}>▼</Text>
        </TouchableOpacity>

        {disabledMessage && <Text style={styles.disabledMessage}>{disabledMessage}</Text>}

        <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalOpen(false)}>
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{label || node.data.name}</Text>
                <TouchableOpacity onPress={() => setModalOpen(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                style={styles.optionsList}
                contentContainerStyle={styles.optionsListContent}
                renderItem={({ item }) => {
                  const isSelected = item.value === normalizedValue;

                  return (
                    <TouchableOpacity
                      style={[styles.option, isSelected && styles.optionSelected]}
                      onPress={() => {
                        setValue(item.value);
                        setModalOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.optionText}>{item.label}</Text>
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {error && <Text style={styles.error}>{error}</Text>}
        {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
      </View>
    );
  }

  // If no responseMapping, render the value as text (read-only)
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label || node.data.name}
        {node.data.required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[styles.input, styles.inputDisabled]}
        value={typeof value === "string" ? value : JSON.stringify(value)}
        editable={false}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  arrow: {
    color: "#6B7280",
    fontSize: 12,
  },
  checkmark: {
    color: "#3B82F6",
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    color: "#6B7280",
    fontSize: 24,
    fontWeight: "300",
  },
  container: {
    marginBottom: 16,
  },
  disabledMessage: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  error: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    textAlign: "center",
  },
  helperText: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderRadius: 6,
    borderWidth: 1,
    color: "#374151",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputDisabled: {
    backgroundColor: "#F9FAFB",
    color: "#9CA3AF",
  },
  label: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  loadingTrigger: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    maxHeight: "80%",
    padding: 16,
    width: "90%",
  },
  modalHeader: {
    alignItems: "center",
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
  },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
  },
  modalTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "600",
  },
  option: {
    alignItems: "center",
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  optionSelected: {
    backgroundColor: "#EFF6FF",
  },
  optionsList: {
    flexGrow: 0,
    flexShrink: 1,
  },
  optionsListContent: {
    flexGrow: 0,
  },
  optionText: {
    color: "#374151",
    flex: 1,
    fontSize: 14,
  },
  required: {
    color: "#EF4444",
  },
  retryButton: {
    marginTop: 12,
  },
  retryButtonText: {
    color: "#3B82F6",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
    borderRadius: 6,
    borderWidth: 1,
    color: "#374151",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  trigger: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  triggerDisabled: {
    backgroundColor: "#F9FAFB",
  },
  triggerError: {
    borderColor: "#EF4444",
  },
  triggerLoader: {
    marginRight: 8,
  },
  triggerPlaceholder: {
    color: "#9CA3AF",
  },
  triggerText: {
    color: "#374151",
    flex: 1,
    fontSize: 14,
  },
});

export default DefaultHttpInput;
