import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import type { NodeRenderProps } from "@/renderer/types/renderer";
import { useTheme } from "@/shared/context/ThemeContext";

type DefaultGroupProps = NodeRenderProps & { children: ReactNode };

const DefaultGroup = ({ children, node }: DefaultGroupProps) => {
  const t = useTranslate();
  const { colors } = useTheme();
  const label = t(node.data.label);

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
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
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
});

export default DefaultGroup;
