import { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/shared/context/ThemeContext";

export interface DefaultSubmitButtonProps {
  children?: ReactNode;
  disabled?: boolean;
  isSubmitting?: boolean;
  onPress?: () => void;
}

const DefaultSubmitButton = ({ children = "Submit", disabled, isSubmitting, onPress }: DefaultSubmitButtonProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors.primary },
        (disabled || isSubmitting) && { backgroundColor: colors.primaryDisabled, opacity: 0.6 },
      ]}
      disabled={disabled || isSubmitting}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {isSubmitting ? (
        <ActivityIndicator color={colors.primaryForeground} />
      ) : (
        <Text style={[styles.buttonText, { color: colors.primaryForeground }]}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 6,
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DefaultSubmitButton;
