import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { InputRenderProps } from "@/renderer/types/renderer";

const DefaultCheckboxInput = ({ node, value, setValue, error, label, helperText }: InputRenderProps<"checkbox">) => {
  const options = node.data.options || [];
  const isMultiple = node.data.multiple;

  // For single checkbox, value is boolean
  // For multiple checkboxes, value is string[]
  const selectedValues = Array.isArray(value) ? value : [];
  const isSingleChecked = typeof value === "boolean" ? value : false;

  const handleToggle = (optionValue: string) => {
    if (isMultiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      setValue(newValues);
    } else {
      // Single checkbox - toggle boolean
      setValue(!isSingleChecked);
    }
  };

  const isChecked = (optionValue: string) => {
    return isMultiple ? selectedValues.includes(optionValue) : isSingleChecked;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label || node.data.name}
        {node.data.required && <Text style={styles.required}>*</Text>}
      </Text>

      {options.length > 0 ? (
        options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.option}
            onPress={() => handleToggle(option.value)}
            disabled={option.disabled}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, isChecked(option.value) && styles.checkboxChecked]}>
              {isChecked(option.value) && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.optionLabel, option.disabled && styles.optionLabelDisabled]}>
              {typeof option.label === "string" ? option.label : option.value}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        // Single checkbox without options
        <TouchableOpacity style={styles.option} onPress={() => setValue(!isSingleChecked)} activeOpacity={0.7}>
          <View style={[styles.checkbox, isSingleChecked && styles.checkboxChecked]}>
            {isSingleChecked && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.optionLabel}>{label || node.data.name}</Text>
        </TouchableOpacity>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderRadius: 4,
    borderWidth: 2,
    height: 20,
    justifyContent: "center",
    marginRight: 12,
    width: 20,
  },
  checkboxChecked: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  container: {
    marginBottom: 16,
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
  option: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8,
  },
  optionLabel: {
    color: "#374151",
    fontSize: 14,
  },
  optionLabelDisabled: {
    color: "#9CA3AF",
  },
  required: {
    color: "#EF4444",
  },
});

export default DefaultCheckboxInput;
