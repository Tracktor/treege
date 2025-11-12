import { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";

export interface DefaultSubmitButtonProps {
  children?: ReactNode;
  disabled?: boolean;
  isSubmitting?: boolean;
  onPress?: () => void;
}

const DefaultSubmitButton = ({ children = "Submit", disabled, isSubmitting, onPress }: DefaultSubmitButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, (disabled || isSubmitting) && styles.buttonDisabled]}
      disabled={disabled || isSubmitting}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>{children}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#3B82F6",
    borderRadius: 6,
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonDisabled: {
    backgroundColor: "#9CA3AF",
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DefaultSubmitButton;
