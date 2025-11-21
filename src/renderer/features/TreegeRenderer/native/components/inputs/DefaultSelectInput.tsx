import { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";

const DefaultSelectInput = ({ node, value, setValue, error, label, placeholder, helperText }: InputRenderProps<"select">) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslate();
  const options = node.data.options || [];
  const isMultiple = node.data.multiple;

  // For single select, value is string
  // For multiple select, value is string[]
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  const handleSelect = (optionValue: string) => {
    if (isMultiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      setValue(newValues);
    } else {
      setValue(optionValue);
      setIsOpen(false);
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder || "Select...";
    }

    if (isMultiple) {
      const selectedLabels = options.filter((opt) => selectedValues.includes(opt.value)).map((opt) => t(opt.label) || opt.value);
      return selectedLabels.join(", ");
    }

    const selectedOption = options.find((opt) => opt.value === selectedValues[0]);
    return selectedOption ? t(selectedOption.label) || selectedOption.value : placeholder || "Select...";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label || node.data.name}
        {node.data.required && <Text style={styles.required}>*</Text>}
      </Text>

      <TouchableOpacity style={[styles.trigger, error && styles.triggerError]} onPress={() => setIsOpen(true)} activeOpacity={0.7}>
        <Text style={[styles.triggerText, selectedValues.length === 0 && styles.triggerPlaceholder]}>{getDisplayText()}</Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsOpen(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || node.data.name}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsList}>
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);

                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => handleSelect(option.value)}
                    disabled={option.disabled}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.optionText, option.disabled && styles.optionTextDisabled]}>{t(option.label) || option.value}</Text>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {isMultiple && (
              <TouchableOpacity style={styles.doneButton} onPress={() => setIsOpen(false)}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            )}
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
  doneButton: {
    alignItems: "center",
    backgroundColor: "#3B82F6",
    borderRadius: 6,
    marginTop: 12,
    paddingVertical: 12,
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
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
    maxHeight: 300,
  },
  optionText: {
    color: "#374151",
    fontSize: 14,
  },
  optionTextDisabled: {
    color: "#9CA3AF",
  },
  required: {
    color: "#EF4444",
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

export default DefaultSelectInput;
