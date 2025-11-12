import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { InputRenderProps } from "@/renderer/types/renderer";

const DefaultPasswordInput = ({ node, value, setValue, error, label, placeholder, helperText, name }: InputRenderProps<"password">) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label || node.data.name}
        {node.data.required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={value ?? ""}
          onChangeText={setValue}
          placeholder={placeholder}
          secureTextEntry={!showPassword}
          accessibilityLabel={name}
        />
        <TouchableOpacity style={styles.toggleButton} onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
          <Text style={styles.toggleText}>{showPassword ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>
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
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  inputWrapper: {
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
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
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: "absolute",
    right: 0,
  },
  toggleText: {
    color: "#3B82F6",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default DefaultPasswordInput;
