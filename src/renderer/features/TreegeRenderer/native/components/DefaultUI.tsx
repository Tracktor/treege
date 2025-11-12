import { StyleSheet, Text, View } from "react-native";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { UiRenderProps } from "@/renderer/types/renderer";

const DefaultTitleUI = ({ node }: UiRenderProps) => {
  const t = useTranslate();
  const label = t(node.data?.label);

  return <Text style={styles.title}>{label}</Text>;
};

const DefaultDividerUI = () => {
  return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    backgroundColor: "#E5E7EB",
    height: 1,
    marginVertical: 16,
  },
  title: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
});

// Export individual components
export { DefaultTitleUI, DefaultDividerUI };

// Default UI renderers mapping
export const defaultUI = {
  divider: DefaultDividerUI,
  title: DefaultTitleUI,
};
