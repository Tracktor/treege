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
import getCategoryOrTypes, { fieldCategory } from "@/features/Treege/TreegeFlow/utils/getCategoryOrTypes";
import { Attributes } from "@/features/Treege/TreegeFlow/utils/types";

interface NodeConfigModalForm {
  category: string;
  children: Attributes[];
  isDecision: boolean;
  label: string;
  name: string;
  type: string;
  value: string;
}

interface NodeConfigModalProps {
  onSave: (config: Attributes & { children?: Attributes[] }) => void;
  onClose: () => void;
  isOpen: boolean;
  initialValues?: Attributes & { children?: Attributes[] };
}

const decisionFields = ["boolean", "select"];

const NodeConfigModal = ({ isOpen, onSave, onClose, initialValues }: NodeConfigModalProps) => {
  const { t } = useTranslation(["translation", "form"]);
  const categoryOrType = initialValues?.type ? getCategoryOrTypes(initialValues.type) : null;
  const initialCategory = typeof categoryOrType === "string" ? String(categoryOrType) : "textArea";

  const {
    Field,
    handleSubmit,
    reset,
    state: { values },
    setFieldValue,
    Subscribe,
  } = useForm({
    defaultValues: {
      category: initialCategory,
      children: initialValues?.children ?? [],
      isDecision: initialValues?.isDecision ?? false,
      label: initialValues?.label ?? "",
      name: initialValues?.name ?? "",
      type: initialValues?.type ?? "text",
      value: initialValues?.value ?? "",
    } as NodeConfigModalForm,
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
              <InputLabel id="node-category-label">{t("category")}</InputLabel>
              <Field name="category">
                {({ state, handleChange }) => (
                  <Select
                    labelId="node-category-label"
                    label={t("category")}
                    value={state.value}
                    onChange={(e) => {
                      const selectedCategory = e.target.value;
                      handleChange(selectedCategory);
                      // Reset type à premier type de la catégorie
                      const firstType = (getCategoryOrTypes(selectedCategory) as string[])[0];
                      setFieldValue("type", firstType);
                      // reset children si besoin
                      setChildren([]);
                    }}
                  >
                    {Object.keys(fieldCategory).map((categoru) => (
                      <MenuItem key={categoru} value={categoru}>
                        {categoru}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </Field>
            </FormControl>

            <Subscribe
              selector={(state) => ({
                isDecision: state.values.isDecision,
                type: state.values.type,
              })}
            >
              {({ type }) => {
                const handleTypeChange = (newType: string) => {
                  setFieldValue("type", newType);

                  // if (newType === "boolean" && isDecision) {
                  //   setChildren([
                  //     { label: "true", name: "true", type: "option", value: "true" },
                  //     { label: "false", name: "false", type: "option", value: "false" },
                  //   ]);
                  // } else {
                  //   setChildren([]);
                  // }
                };

                return (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="node-type-label">{t("type")}</InputLabel>
                    <Select labelId="node-type-label" label={t("type")} value={type} onChange={(e) => handleTypeChange(e.target.value)}>
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="boolean">Boolean</MenuItem>
                    </Select>
                  </FormControl>
                );
              }}
            </Subscribe>
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

            <Subscribe
              selector={(state) => ({
                children: state.values.children,
                isDecision: state.values.isDecision,
              })}
            >
              {({ isDecision, children }) =>
                isDecision &&
                children.map((child: Attributes, idx: number) => (
                  <Stack key={child.name ?? idx} direction="row" spacing={2}>
                    <TextField fullWidth label="Name" value={child.name} onChange={(e) => handleChildChange(idx, "name", e.target.value)} />
                    <TextField
                      fullWidth
                      label="Value"
                      value={child.value}
                      onChange={(e) => handleChildChange(idx, "value", e.target.value)}
                    />
                  </Stack>
                ))
              }
            </Subscribe>
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
