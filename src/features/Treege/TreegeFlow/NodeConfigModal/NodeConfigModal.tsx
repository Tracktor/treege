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
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { NodeOptions } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

interface NodeConfigModalProps {
  isOpen: boolean;
  onSave: (config: NodeOptions) => void;
  onClose: () => void;
}

const decisionFields = ["boolean", "select"];

// NodeConfigModal.tsx
const NodeConfigModal = ({ isOpen, onSave, onClose }: NodeConfigModalProps) => {
  const { t } = useTranslation(["translation", "form"]);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("text");
  const [isDecision, setIsDecision] = useState<boolean>(false);
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([]);

  const isBooleanType = type === "boolean";

  const canBeDecisionField = decisionFields.includes(type);

  const handleClose = () => {
    setName("");
    setType("text");
    setIsDecision(false);
    setAttributes([]);
    onClose();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({ attributes, isDecision, name, type });

    handleClose();
  };

  const handleAttrChange = (idx: number, key: string, value: string) => {
    const newAttrs = [...attributes];
    newAttrs[idx] = { ...newAttrs[idx], [key]: value };
    setAttributes(newAttrs);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>{t("addNode")}</DialogTitle>
        <DialogCloseIcon onClick={handleClose} />
        <DialogContent>
          <Stack spacing={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="node-type-label">{t("type")}</InputLabel>
              <Select
                labelId="node-type-label"
                label={t("type")}
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  if (e.target.value === "boolean" && isDecision) {
                    setAttributes([
                      { key: "true", value: "true" },
                      { key: "false", value: "false" },
                    ]);
                  } else {
                    setAttributes([]);
                  }
                }}
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="boolean">Boolean</MenuItem>
              </Select>
            </FormControl>

            <TextField required fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} />

            {canBeDecisionField && (
              <FormControl fullWidth>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isDecision}
                      onChange={(e) => {
                        setIsDecision(e.target.checked);
                        if (isBooleanType && e.target.checked) {
                          setAttributes([
                            { key: "true", value: "true" },
                            { key: "false", value: "false" },
                          ]);
                        } else {
                          setAttributes([]);
                        }
                      }}
                      color="primary"
                    />
                  }
                  label={t("form:decisionField")}
                />
              </FormControl>
            )}

            {!isBooleanType &&
              attributes.map((attr, idx) => (
                <Stack key={attr.key} direction="row" spacing={2}>
                  <TextField fullWidth label="key" value={attr.key} onChange={(e) => handleAttrChange(idx, "name", e.target.value)} />
                  <TextField fullWidth label="Value" value={attr.value} onChange={(e) => handleAttrChange(idx, "value", e.target.value)} />
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
