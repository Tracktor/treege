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
import { NodeOptions } from "@/features/Treege/TreegeFlow/utils/types";

interface NodeConfigModalProps {
  onSave: (config: NodeOptions & { options?: NodeOptions[] }) => void;
  onClose: () => void;
  isOpen: boolean;
}

const decisionFields = ["boolean", "select"];

const NodeConfigModal = ({ isOpen, onSave, onClose }: NodeConfigModalProps) => {
  const { t } = useTranslation(["translation", "form"]);
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("text");
  const [isDecision, setIsDecision] = useState(false);
  const [options, setOptions] = useState<NodeOptions[]>([]);

  const isBooleanType = type === "boolean";
  const canBeDecisionField = decisionFields.includes(type);

  const handleClose = () => {
    setName("");
    setLabel("");
    setValue("");
    setType("text");
    setIsDecision(false);
    setOptions([]);
    onClose();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSave({
      isDecision,
      label,
      name,
      options,
      type,
      value,
    });
    handleClose();
  };

  const handleOptionChange = (idx: number, key: keyof NodeOptions, newValue: string) => {
    const newOptions = [...options];
    newOptions[idx] = { ...newOptions[idx], [key]: newValue };
    setOptions(newOptions);
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
                  const selectedType = e.target.value;
                  setType(selectedType);

                  if (selectedType === "boolean" && isDecision) {
                    setOptions([
                      { label: "true", name: "true", type: "option", value: "true" },
                      { label: "false", name: "false", type: "option", value: "false" },
                    ]);
                  } else {
                    setOptions([]);
                  }
                }}
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="boolean">Boolean</MenuItem>
              </Select>
            </FormControl>

            <TextField required fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField fullWidth label="Label" value={label} onChange={(e) => setLabel(e.target.value)} />
            <TextField fullWidth label="Value" value={value} onChange={(e) => setValue(e.target.value)} />

            {canBeDecisionField && (
              <FormControl fullWidth>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isDecision}
                      onChange={(e) => {
                        setIsDecision(e.target.checked);
                        if (isBooleanType && e.target.checked) {
                          setOptions([
                            { label: "true", name: "true", type: "option", value: "true" },
                            { label: "false", name: "false", type: "option", value: "false" },
                          ]);
                        } else {
                          setOptions([]);
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
              options.map((opt, idx) => (
                <Stack key={opt.name} direction="row" spacing={2}>
                  <TextField fullWidth label="Name" value={opt.name} onChange={(e) => handleOptionChange(idx, "name", e.target.value)} />
                  <TextField fullWidth label="Value" value={opt.value} onChange={(e) => handleOptionChange(idx, "value", e.target.value)} />
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
