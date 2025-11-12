import { StyleSheet, Text, TextInput, View } from "react-native";
import { InputRenderProps } from "@/renderer/types/renderer";

const DefaultTextareaInput = ({ node, value, setValue, error, label, placeholder, helperText, name }: InputRenderProps<"textarea">) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label || node.data.name}
        {node.data.required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[styles.textarea, error && styles.textareaError]}
        value={value ?? ""}
        onChangeText={setValue}
        placeholder={placeholder}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
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
  label: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  textarea: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderRadius: 6,
    borderWidth: 1,
    fontSize: 14,
    minHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textareaError: {
    borderColor: "#EF4444",
  },
});

export default DefaultTextareaInput;
