import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { InputRenderProps } from "@/renderer/types/renderer";

const DefaultRadioInput = ({ node, value, setValue, error, label, helperText }: InputRenderProps<"radio">) => {
  const options = node.data.options || [];
  const selectedValue = value || "";

  const handleSelect = (optionValue: string) => {
    setValue(optionValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label || node.data.name}
        {node.data.required && <Text style={styles.required}>*</Text>}
      </Text>

      {options.map((option) => {
        const isSelected = selectedValue === option.value;

        return (
          <TouchableOpacity
            key={option.value}
            style={styles.option}
            onPress={() => handleSelect(option.value)}
            disabled={option.disabled}
            activeOpacity={0.7}
          >
            <View style={[styles.radio, isSelected && styles.radioSelected]}>{isSelected && <View style={styles.radioInner} />}</View>
            <Text style={[styles.optionLabel, option.disabled && styles.optionLabelDisabled]}>
              {typeof option.label === "string" ? option.label : option.value}
            </Text>
          </TouchableOpacity>
        );
      })}

      {error && <Text style={styles.error}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
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
  radio: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderRadius: 10,
    borderWidth: 2,
    height: 20,
    justifyContent: "center",
    marginRight: 12,
    width: 20,
  },
  radioInner: {
    backgroundColor: "#3B82F6",
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  radioSelected: {
    borderColor: "#3B82F6",
  },
  required: {
    color: "#EF4444",
  },
});

export default DefaultRadioInput;
