import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export interface DefaultFormWrapperProps {
  children: ReactNode;
  onSubmit?: () => void;
}

const DefaultFormWrapper = ({ children }: DefaultFormWrapperProps) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default DefaultFormWrapper;
