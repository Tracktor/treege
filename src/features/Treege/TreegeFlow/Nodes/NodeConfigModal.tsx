import { useForm } from "@tanstack/react-form";
import {
  Dialog,
  DialogContent,
  Box,
  DialogActions,
  Button,
  DialogCloseIcon,
  DialogTitle,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@tracktor/design-system";
import { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Attributes } from "@/features/Treege/TreegeFlow/utils/types";

interface NodeConfigModalProps {
  onSave: (config: Attributes & { children?: Attributes[] }) => void;
  onClose: () => void;
  isOpen: boolean;
  initialValues?: Attributes & { children?: Attributes[] };
}

const decisionFields = ["boolean", "select"];

const NodeConfigModal = ({ isOpen, onSave, onClose, initialValues }: NodeConfigModalProps) => {
  const { t } = useTranslation(["translation", "form"]);

  const {
    Field,
    handleSubmit,
    reset,
    state: { values },
    setFieldValue,
  } = useForm({
    defaultValues: {
      children: initialValues?.children ?? [],
      isDecision: initialValues?.isDecision ?? false,
      label: initialValues?.label ?? "",
      name: initialValues?.name ?? "",
      type: initialValues?.type ?? "text",
      value: initialValues?.value ?? "",
    },
    onSubmit: ({ value }) => {
      onSave(value);
      reset();
      onClose();
    },
  });

  const isBooleanType = values.type === "boolean";
  const canBeDecisionField = decisionFields.includes(values.type);

  const handleClose = () => {
    reset();
    onClose();
  };

  const setChildren = (children: Attributes[]) => {
    setFieldValue("children", children);
  };

  const handleChildChange = (idx: number, key: keyof Attributes, newValue: string) => {
    const newChildren = [...values.children];
    newChildren[idx] = { ...newChildren[idx], [key]: newValue };
    setChildren(newChildren);
  };

  const onSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit().then();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={onSubmitForm}>
        <DialogTitle>{t("addNode")}</DialogTitle>
        <DialogCloseIcon onClick={handleClose} />

        <DialogContent>
          <Stack spacing={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="node-type-label">{t("type")}</InputLabel>
              <Field name="type">
                {({ state, handleChange }) => (
                  <Select
                    labelId="node-type-label"
                    label={t("type")}
                    value={state.value}
                    onChange={(e) => {
                      const selectedType = e.target.value;
                      handleChange(selectedType);

                      if (selectedType === "boolean" && values.isDecision) {
                        setChildren([
                          { label: "true", name: "true", type: "option", value: "true" },
                          { label: "false", name: "false", type: "option", value: "false" },
                        ]);
                      } else {
                        setChildren([]);
                      }
                    }}
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="boolean">Boolean</MenuItem>
                  </Select>
                )}
              </Field>
            </FormControl>

            <Field name="name">
              {({ state, handleChange }) => (
                <TextField required fullWidth label="Name" value={state.value} onChange={(e) => handleChange(e.target.value)} />
              )}
            </Field>

            <Field name="label">
              {({ state, handleChange }) => (
                <TextField fullWidth label="Label" value={state.value} onChange={(e) => handleChange(e.target.value)} />
              )}
            </Field>

            <Field name="value">
              {({ state, handleChange }) => (
                <TextField fullWidth label="Value" value={state.value} onChange={(e) => handleChange(e.target.value)} />
              )}
            </Field>

            {canBeDecisionField && (
              <FormControl fullWidth>
                <Field name="isDecision">
                  {({ state, handleChange }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.value}
                          onChange={(e) => {
                            handleChange(e.target.checked);

                            if (isBooleanType && e.target.checked) {
                              setChildren([
                                { label: "true", name: "true", type: "option", value: "true" },
                                { label: "false", name: "false", type: "option", value: "false" },
                              ]);
                            } else {
                              setChildren([]);
                            }
                          }}
                          color="primary"
                        />
                      }
                      label={t("form:decisionField")}
                    />
                  )}
                </Field>
              </FormControl>
            )}

            {!isBooleanType &&
              values.children.map((child, idx) => (
                <Stack key={child.name} direction="row" spacing={2}>
                  <TextField fullWidth label="Name" value={child.name} onChange={(e) => handleChildChange(idx, "name", e.target.value)} />
                  <TextField
                    fullWidth
                    label="Value"
                    value={child.value}
                    onChange={(e) => handleChildChange(idx, "value", e.target.value)}
                  />
                </Stack>
              ))}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="text">
            {t("cancel")}
          </Button>
          <Button type="submit" variant="outlined">
            {t("save")}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default NodeConfigModal;
