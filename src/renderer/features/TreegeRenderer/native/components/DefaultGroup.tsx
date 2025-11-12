import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

export interface DefaultGroupProps {
  children: ReactNode;
  label?: string;
}

const DefaultGroup = ({ children, label }: DefaultGroupProps) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  content: {
    gap: 8,
  },
  label: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
});

export default DefaultGroup;
