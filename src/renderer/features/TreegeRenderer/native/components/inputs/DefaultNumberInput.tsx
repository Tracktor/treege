import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { InputRenderProps } from "@/renderer/types/renderer";

const DefaultNumberInput = ({ node, value, setValue, error, label, placeholder, helperText, name }: InputRenderProps<"number">) => {
  const [textValue, setTextValue] = useState(value?.toString() ?? "");

  useEffect(() => {
    setTextValue(value?.toString() ?? "");
  }, [value]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label || node.data.name}
        {node.data.required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={textValue}
        onChangeText={(text) => {
          setTextValue(text);

          if (text.trim() === "") {
            setValue(null);
            return;
          }

          const parsed = Number(text);
          if (!Number.isNaN(parsed)) {
            setValue(parsed);
          }
        }}
        placeholder={placeholder}
        keyboardType="numeric"
        accessibilityLabel={name}
      />
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
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderRadius: 6,
    borderWidth: 1,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  label: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
});

export default DefaultNumberInput;
