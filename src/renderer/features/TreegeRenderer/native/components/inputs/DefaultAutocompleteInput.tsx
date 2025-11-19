import { useMemo, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";

const DefaultAutocompleteInput = ({ node, value, setValue, error, label, placeholder, helperText }: InputRenderProps<"autocomplete">) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslate();
  const options = node.data.options || [];

  // Find selected option to display label
  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return options;
    }

    const query = searchQuery.toLowerCase();
    return options.filter((option) => {
      const optionLabel = t(option.label);
      return optionLabel.toLowerCase().includes(query) || option.value.toLowerCase().includes(query);
    });
  }, [options, searchQuery, t]);

  const handleSelect = (optionValue: string) => {
    // Toggle behavior: selecting same value deselects it
    setValue(optionValue === value ? "" : optionValue);
    setIsOpen(false);
    setSearchQuery(""); // Reset search on close
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery(""); // Reset search on close
  };

  const getDisplayText = () => {
    if (!(value && selectedOption)) {
      return placeholder || t("renderer.defaultAutocompleteInput.selectOption");
    }
    return t(selectedOption.label);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label || node.data.name}
        {node.data.required && <Text style={styles.required}>*</Text>}
      </Text>

      <TouchableOpacity style={[styles.trigger, error && styles.triggerError]} onPress={() => setIsOpen(true)} activeOpacity={0.7}>
        <Text style={[styles.triggerText, !value && styles.triggerPlaceholder]}>{getDisplayText()}</Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={handleClose}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={handleClose}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || node.data.name}</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder={placeholder || t("renderer.defaultAutocompleteInput.search")}
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              style={styles.optionsList}
              contentContainerStyle={styles.optionsListContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>{t("renderer.defaultAutocompleteInput.noResults")}</Text>
                </View>
              }
              renderItem={({ item }) => {
                const isSelected = item.value === value;

                return (
                  <TouchableOpacity
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => handleSelect(item.value)}
                    disabled={item.disabled}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.optionText, item.disabled && styles.optionTextDisabled]}>{t(item.label)}</Text>
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
  helperText: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 4,
  },
  label: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
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
  optionTextDisabled: {
    color: "#9CA3AF",
  },
  required: {
    color: "#EF4444",
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
  triggerError: {
    borderColor: "#EF4444",
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

export default DefaultAutocompleteInput;
