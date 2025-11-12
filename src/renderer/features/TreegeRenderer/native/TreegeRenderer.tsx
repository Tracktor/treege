import { ScrollView, StyleSheet, Text, View } from "react-native";
import { TreegeRendererProvider } from "@/renderer/context/TreegeRendererContext";
import DefaultFormWrapper from "@/renderer/features/TreegeRenderer/native/components/DefaultFormWrapper";
import DefaultGroup from "@/renderer/features/TreegeRenderer/native/components/DefaultGroup";
import { defaultInputRenderers } from "@/renderer/features/TreegeRenderer/native/components/DefaultInputs";
import DefaultSubmitButton from "@/renderer/features/TreegeRenderer/native/components/DefaultSubmitButton";
import { defaultUI } from "@/renderer/features/TreegeRenderer/native/components/DefaultUI";
import { useTreegeRenderer } from "@/renderer/features/TreegeRenderer/useTreegeRenderer";
import { useRenderNode } from "@/renderer/hooks/useRenderNode";
import { TreegeRendererNativeProps } from "@/renderer/types/renderer";

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
  // Use shared logic hook
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

  const renderNode = useRenderNode({
    config,
    DefaultGroup,
    defaultInputRenderers,
    defaultUI,
    formErrors,
    formValues,
    missingRequiredFields,
    setFieldValue,
    visibleNodes,
  });

  // Components with fallbacks
  const FormWrapper = config.components.form || DefaultFormWrapper;
  const SubmitButton = config.components.submitButton || DefaultSubmitButton;

  return (
    <ScrollView style={[styles.container, style]} contentContainerStyle={contentContainerStyle}>
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
            <SubmitButton onPress={handleSubmit} disabled={isSubmitting} isSubmitting={isSubmitting}>
              {t("renderer.defaultSubmitButton.submit")}
            </SubmitButton>
          )}
        </FormWrapper>

        {/* Powered by Treege */}
        <Text style={styles.poweredBy}>Powered by Treege</Text>

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
