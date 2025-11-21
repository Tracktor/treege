import { ScrollView, StyleSheet, Text, View, ViewStyle } from "react-native";
import { TreegeRendererProvider } from "@/renderer/context/TreegeRendererContext";
import DefaultFormWrapper from "@/renderer/features/TreegeRenderer/native/components/DefaultFormWrapper";
import DefaultGroup from "@/renderer/features/TreegeRenderer/native/components/DefaultGroup";
import { defaultInputRenderers } from "@/renderer/features/TreegeRenderer/native/components/DefaultInputs";
import DefaultSubmitButton from "@/renderer/features/TreegeRenderer/native/components/DefaultSubmitButton";
import DefaultSubmitButtonWrapper from "@/renderer/features/TreegeRenderer/native/components/DefaultSubmitButtonWrapper";
import { defaultUI } from "@/renderer/features/TreegeRenderer/native/components/DefaultUI";
import { useTreegeRenderer } from "@/renderer/features/TreegeRenderer/useTreegeRenderer";
import { useRenderNode } from "@/renderer/hooks/useRenderNode";
import { TreegeRendererProps } from "@/renderer/types/renderer";

/**
 * Props for the TreegeRenderer component (React Native)
 * Same as TreegeRendererProps but:
 * - Omits className (not used in React Native)
 * - Omits theme (not used in React Native)
 * - Adds style and contentContainerStyle (React Native specific)
 */
export type TreegeRendererNativeProps = Omit<TreegeRendererProps, "className" | "theme"> & {
  /**
   * Style for the ScrollView container
   */
  style?: ViewStyle;
  /**
   * Style for the ScrollView content container
   * Use this to center content vertically with flexGrow: 1 and justifyContent: 'center'
   */
  contentContainerStyle?: ViewStyle;
};

const TreegeRenderer = ({
  components,
  contentContainerStyle,
  flows,
  googleApiKey,
  language,
  onChange,
  onSubmit,
  style,
  validate,
  validationMode,
  initialValues = {},
}: TreegeRendererNativeProps) => {
  const {
    canSubmit,
    clearSubmitMessage,
    config,
    formErrors,
    formValues,
    handleSubmit,
    inputNodes,
    isSubmitting,
    mergedFlow,
    missingRequiredFields,
    setFieldValue,
    submitMessage,
    t,
    visibleNodes,
    visibleRootNodes,
  } = useTreegeRenderer({
    components,
    flows,
    googleApiKey,
    initialValues,
    language,
    onChange,
    onSubmit,
    validate,
    validationMode,
  });

  const { FormWrapper, SubmitButton, SubmitButtonWrapper, renderNode } = useRenderNode({
    config,
    DefaultFormWrapper,
    DefaultGroup,
    DefaultSubmitButton,
    DefaultSubmitButtonWrapper,
    defaultInputRenderers,
    defaultUI,
    formErrors,
    formValues,
    missingRequiredFields,
    setFieldValue,
    visibleNodes,
  });

  return (
    <ScrollView nestedScrollEnabled style={[styles.container, style]} contentContainerStyle={contentContainerStyle}>
      <TreegeRendererProvider
        value={{
          flows: mergedFlow,
          formErrors,
          formValues,
          googleApiKey: config.googleApiKey,
          inputNodes,
          language: config.language,
          setFieldValue,
        }}
      >
        <FormWrapper onSubmit={handleSubmit}>
          {/* Nodes */}
          {visibleRootNodes.map((node) => renderNode(node))}

          {/* Submit Button */}
          {canSubmit && (
            <SubmitButtonWrapper missingFields={missingRequiredFields}>
              <SubmitButton onPress={handleSubmit} disabled={isSubmitting} isSubmitting={isSubmitting}>
                {t("renderer.defaultSubmitButton.submit")}
              </SubmitButton>
            </SubmitButtonWrapper>
          )}

          {/* Powered by Treege */}
          <Text style={styles.poweredBy}>Powered by Treege</Text>
        </FormWrapper>

        {/* Submit message (success/error) */}
        {submitMessage && (
          <View style={[styles.message, submitMessage.type === "success" ? styles.messageSuccess : styles.messageError]}>
            <Text style={styles.messageText}>{submitMessage.message}</Text>
            <Text style={styles.messageClose} onPress={clearSubmitMessage}>
              {t("common.close")}
            </Text>
          </View>
        )}
      </TreegeRendererProvider>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    borderRadius: 6,
    marginVertical: 16,
    padding: 16,
  },
  messageClose: {
    fontSize: 14,
    marginTop: 8,
    textDecorationLine: "underline",
  },
  messageError: {
    backgroundColor: "#FEE2E2",
  },
  messageSuccess: {
    backgroundColor: "#D1FAE5",
  },
  messageText: {
    fontSize: 14,
    fontWeight: "500",
  },
  poweredBy: {
    color: "#9CA3AF",
    fontSize: 12,
    paddingVertical: 8,
    textAlign: "center",
  },
});

export default TreegeRenderer;
