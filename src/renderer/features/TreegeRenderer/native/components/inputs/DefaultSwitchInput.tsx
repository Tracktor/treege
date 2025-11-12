import { StyleSheet, Switch, Text, View } from "react-native";
import { InputRenderProps } from "@/renderer/types/renderer";

const DefaultSwitchInput = ({ node, value, setValue, error, label, helperText }: InputRenderProps<"switch">) => {
  const isEnabled = Boolean(value);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label || node.data.name}
            {node.data.required && <Text style={styles.required}>*</Text>}
          </Text>
        </View>
        <Switch
          trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
          thumbColor={isEnabled ? "#3B82F6" : "#F3F4F6"}
          ios_backgroundColor="#D1D5DB"
          onValueChange={setValue}
          value={isEnabled}
        />
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
  label: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },
  labelContainer: {
    flex: 1,
  },
  required: {
    color: "#EF4444",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default DefaultSwitchInput;
