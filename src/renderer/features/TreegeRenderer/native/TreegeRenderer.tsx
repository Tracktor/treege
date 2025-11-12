import { Node } from "@xyflow/react";
import { ReactNode, useCallback } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { TreegeRendererProvider } from "@/renderer/context/TreegeRendererContext";
import DefaultFormWrapper from "@/renderer/features/TreegeRenderer/native/components/DefaultFormWrapper";
import DefaultGroup from "@/renderer/features/TreegeRenderer/native/components/DefaultGroup";
import { defaultInputRenderers } from "@/renderer/features/TreegeRenderer/native/components/DefaultInputs";
import DefaultSubmitButton from "@/renderer/features/TreegeRenderer/native/components/DefaultSubmitButton";
import { defaultUI } from "@/renderer/features/TreegeRenderer/native/components/DefaultUI";
import { useTreegeRenderer } from "@/renderer/features/TreegeRenderer/useTreegeRenderer";
import { InputRenderProps, InputValue, TreegeRendererNativeProps } from "@/renderer/types/renderer";
import { resolveNodeKey } from "@/renderer/utils/node";
import { sanitize } from "@/renderer/utils/sanitize";
import { NODE_TYPE } from "@/shared/constants/node";
import { TreegeNodeData, UINodeData } from "@/shared/types/node";
import { isGroupNode, isInputNode, isUINode } from "@/shared/utils/nodeTypeGuards";
import { getTranslatedText } from "@/shared/utils/translations";

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

  // Components with fallbacks
  const FormWrapper = config.components.form || DefaultFormWrapper;
  const SubmitButton = config.components.submitButton || DefaultSubmitButton;

  const renderNode = useCallback(
    (node: Node<TreegeNodeData>): ReactNode => {
      const { type } = node;

      switch (type) {
        case NODE_TYPE.input: {
          if (!isInputNode(node)) {
            return null;
          }

          const inputData = node.data;
          const inputType = inputData.type || "text";
          const CustomRenderer = config.components.inputs?.[inputType];
          const DefaultRenderer = defaultInputRenderers[inputType as keyof typeof defaultInputRenderers];
          const Renderer = (CustomRenderer || DefaultRenderer) as (props: InputRenderProps) => ReactNode;
          const setValue = (newValue: InputValue) => setFieldValue(fieldId, newValue);
          const fieldId = node.id;
          const value = formValues[fieldId];
          const error = formErrors[fieldId];
          const label = getTranslatedText(inputData.label, config.language);
          const placeholder = getTranslatedText(inputData.placeholder, config.language);
          const helperText = getTranslatedText(inputData.helperText, config.language);
          const name = resolveNodeKey(node);
          // Sanitize all user-controlled text to prevent XSS attacks (plainTextOnly: true by default)
          const safeLabel = sanitize(label);
          const safePlaceholder = sanitize(placeholder);
          const safeHelperText = sanitize(helperText);

          return (
            <Renderer
              key={node.id}
              id={node.id}
              node={node}
              value={value}
              error={error}
              label={safeLabel}
              placeholder={safePlaceholder}
              helperText={safeHelperText}
              name={name}
              setValue={setValue}
              missingRequiredFields={missingRequiredFields}
            />
          );
        }

        case NODE_TYPE.group: {
          if (!isGroupNode(node)) {
            return null;
          }

          const GroupComponent = config.components.group || DefaultGroup;
          // Filter children - visibleNodes maintains flow order from getFlowRenderState
          const childNodes = visibleNodes.filter((child) => child.parentId === node.id);

          return (
            <GroupComponent key={node.id} node={node}>
              {childNodes.map((child) => renderNode(child))}
            </GroupComponent>
          );
        }

        case NODE_TYPE.ui: {
          if (!isUINode(node)) {
            return null;
          }

          const uiData = node.data as UINodeData;
          const uiType = uiData.type || "title";
          const CustomRenderer = config.components.ui?.[uiType];
          const DefaultRenderer = defaultUI[uiType as keyof typeof defaultUI];
          const Renderer = CustomRenderer || DefaultRenderer;

          return <Renderer key={node.id} node={node} />;
        }

        case NODE_TYPE.flow: {
          // FlowNodes are already merged in the pre-processing step
          // So we should never reach here, but just in case, return null
          return null;
        }

        default:
          console.warn("Unknown node type:", type);
          return null;
      }
    },
    [config.components, config.language, visibleNodes, formValues, formErrors, setFieldValue, missingRequiredFields],
  );

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
