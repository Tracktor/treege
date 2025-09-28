import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
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
  ListSubheader,
  Typography,
  IconButton,
} from "@tracktor/design-system";
import type { TreeNode, FieldType } from "@tracktor/types-treege";
import { useTranslation } from "react-i18next";
import useNodeMutationDialog from "@/features/TreegeFlow/Nodes/NodeMutationDialog/useNodeMutationDialog";
import { fieldCategory, fieldCategoryOrder } from "@/features/TreegeFlow/utils/getCategoryOrTypes";

interface NodeConfigModalProps {
  onSave: (config: TreeNode["attributes"] & { children?: TreeNode[] }) => void;
  onClose: () => void;
  isOpen: boolean;
  initialValues?: TreeNode["attributes"] & { children?: TreeNode[] };
}

const NodeMutationDialog = ({ isOpen, onSave, onClose, initialValues }: NodeConfigModalProps) => {
  const { t } = useTranslation(["translation", "form"]);
  const { handleClose, handleAddChild, setFieldValue, Field, onSubmitForm, Subscribe, setChildren } = useNodeMutationDialog({
    initialValues,
    onClose,
    onSave,
  });

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={onSubmitForm}>
        <DialogTitle>{t("addNode")}</DialogTitle>
        <DialogCloseIcon onClick={handleClose} />

        <DialogContent>
          <Stack spacing={2}>
            {/* TYPE */}
            <Stack direction="row" spacing={2}>
              <Field name="type">
                {({ state, handleChange }) => (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="node-type-label">{t("type")}</InputLabel>
                    <Select
                      labelId="node-type-label"
                      label={t("type")}
                      value={state.value}
                      onChange={(e) => {
                        const selectedType = e.target.value;
                        handleChange(selectedType);

                        const categoryFound = Object.entries(fieldCategory).find(([_, types]) => types.includes(selectedType as never));
                        if (categoryFound) {
                          setFieldValue("category", categoryFound[0]);
                        }
                      }}
                    >
                      {fieldCategoryOrder.map((categoryKey) => {
                        const types = fieldCategory[categoryKey];
                        return [
                          <ListSubheader key={`${categoryKey}-header`}>
                            {t(`form:category.${categoryKey as keyof typeof fieldCategory}`)}
                          </ListSubheader>,
                          ...types.map((typeOption) => (
                            <MenuItem key={typeOption} value={typeOption}>
                              {t(`form:type.${typeOption as FieldType}`)}
                            </MenuItem>
                          )),
                        ];
                      })}
                    </Select>
                  </FormControl>
                )}
              </Field>
            </Stack>

            {/* NAME + LABEL */}
            <Stack direction="row" spacing={2}>
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
            </Stack>

            {/* CHECKBOX DECISION */}
            <Subscribe
              selector={(state) => ({
                category: state.values.category,
                children: state.values.children,
              })}
            >
              {({ category, children }) =>
                category === "decision" ? (
                  <FormControl fullWidth>
                    <Field name="isDecision">
                      {({ state, handleChange }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={state.value}
                              onChange={(e) => {
                                const { checked } = e.target;
                                handleChange(checked);
                                if (checked && children.length === 0) {
                                  handleAddChild();
                                  return;
                                }
                                if (!checked) {
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
                ) : null
              }
            </Subscribe>

            {/* CHILDREN */}
            <Subscribe
              selector={(state) => ({
                children: state.values.children,
                isDecision: state.values.isDecision,
                parentName: state.values.name,
              })}
            >
              {({ isDecision, parentName }) =>
                isDecision ? (
                  <Field name="children" mode="array">
                    {({ state, pushValue, removeValue, handleChange }) => (
                      <Stack spacing={2}>
                        <Typography variant="h4">{t("values")}</Typography>
                        {state.value.map((child, idx) => (
                          <Stack key={child.name || `child-${idx}`} direction={{ sm: "row", xs: "column" }} spacing={1} paddingY={1}>
                            <TextField
                              fullWidth
                              label={t("form:label")}
                              value={child.label ?? ""}
                              onChange={(e) => handleChange(state.value.map((c, i) => (i === idx ? { ...c, label: e.target.value } : c)))}
                            />
                            <TextField
                              fullWidth
                              label={t("form:value")}
                              value={child.value ?? ""}
                              onChange={(e) => handleChange(state.value.map((c, i) => (i === idx ? { ...c, value: e.target.value } : c)))}
                            />
                            <TextField
                              fullWidth
                              label={t("form:message")}
                              value={child.message ?? ""}
                              onChange={(e) => handleChange(state.value.map((c, i) => (i === idx ? { ...c, message: e.target.value } : c)))}
                            />
                            {state.value.length > 1 && (
                              <IconButton color="warning" onClick={() => removeValue(idx)} sx={{ alignSelf: "center" }}>
                                <RemoveCircleRoundedIcon />
                              </IconButton>
                            )}
                          </Stack>
                        ))}
                        <Box justifyContent="flex-end" display="flex">
                          <IconButton
                            color="success"
                            onClick={() =>
                              pushValue({
                                label: "",
                                message: "",
                                name: `${parentName}:`,
                                value: "",
                              })
                            }
                          >
                            <AddCircleRoundedIcon />
                          </IconButton>
                        </Box>
                      </Stack>
                    )}
                  </Field>
                ) : null
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

export default NodeMutationDialog;
