import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "design-system";
import { useTranslation } from "react-i18next";
import styles from "./FormTreeCardMutation.module.scss";
import useFormTreeCardMutation from "@/features/Forms/FormTreeCardMutation/useFormTreeCardMutation";

interface FormTreeCardMutationProps {
  onClose?(): void;
}

const FormTreeCardMutation = ({ onClose }: FormTreeCardMutationProps) => {
  const { t } = useTranslation(["translation", "form"]);

  const {
    requiredDisabled,
    decisionValues,
    required,
    disabled,
    name,
    type,
    step,
    label,
    isDecisionField,
    handleChangeRequired,
    handleChangeDisabled,
    handleChangeName,
    handleChangeType,
    handleChangeOptionLabel,
    handleDeleteValue,
    handleChangeOptionValue,
    handleSubmit,
    handleAddValue,
    getDisabledValueField,
    handleChangeStep,
    handleChangeLabel,
  } = useFormTreeCardMutation();

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={1} paddingY={1} direction={{ sm: "row", xs: "column" }}>
        <TextField sx={{ flex: 1 }} label={t("label", { ns: "form" })} onChange={handleChangeLabel} value={label} required />
        <TextField
          label={t("name")}
          sx={{ flex: 1 }}
          onChange={handleChangeName}
          value={name}
          helperText={t("mustBeUnique", { ns: "form" })}
          required
        />
      </Stack>

      <Stack spacing={1} paddingY={1} direction={{ sm: "row", xs: "column" }}>
        <FormControl sx={{ flex: 1 }} required>
          <InputLabel>{t("type")}</InputLabel>
          <Select value={type} label={t("type")} onChange={handleChangeType}>
            <MenuItem value="number">{t("type.number", { ns: "form" })}</MenuItem>
            <MenuItem value="text">{t("type.text", { ns: "form" })}</MenuItem>
            <MenuItem value="switch">{t("type.switch", { ns: "form" })}</MenuItem>
            <MenuItem value="checkbox">{t("type.checkbox", { ns: "form" })}</MenuItem>
            <MenuItem value="radio">
              <Typography color="secondary">{t("type.radio", { ns: "form" })}</Typography>
            </MenuItem>
            <MenuItem value="select">
              <Typography color="secondary">{t("type.select", { ns: "form" })}</Typography>
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          sx={{ flex: 1 }}
          label={t("step", { ns: "form" })}
          onChange={handleChangeStep}
          value={step}
          type="number"
          inputProps={{ min: 0 }}
        />
      </Stack>

      <Stack direction="row" spacing={1} paddingY={1} alignItems="center" justifyContent="space-between">
        <Box>
          <FormGroup>
            <FormControlLabel
              disabled={requiredDisabled}
              control={<Checkbox checked={required} onChange={handleChangeRequired} />}
              label={t("required")}
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel control={<Checkbox checked={disabled} onChange={handleChangeDisabled} />} label={t("disabled")} />
          </FormGroup>
        </Box>
      </Stack>

      {isDecisionField && (
        <>
          <h4>{t("decisionValues")}</h4>
          {decisionValues?.map(({ value, label: labelOption, id }, index) => (
            <Stack direction={{ sm: "row", xs: "column" }} spacing={1} paddingY={1} key={id} position="relative">
              <TextField
                label="Label"
                sx={{ flex: 1 }}
                onChange={handleChangeOptionLabel}
                value={labelOption}
                inputProps={{ "data-id": id }}
                disabled={getDisabledValueField(index)}
                required
              />
              <TextField
                label="Valeur"
                sx={{ flex: 1 }}
                onChange={handleChangeOptionValue}
                value={value}
                inputProps={{ "data-id": id }}
                disabled={getDisabledValueField(index)}
                required
              />
              {decisionValues.length > 1 && (
                <Button color="warning" className={styles.IconButtonDelete} data-id={id} onClick={() => handleDeleteValue(id)}>
                  <RemoveCircleRoundedIcon />
                </Button>
              )}
            </Stack>
          ))}
        </>
      )}

      {isDecisionField && (
        <Box justifyContent="flex-end" display="flex">
          <Button color="success" className={styles.IconButton} onClick={handleAddValue}>
            <AddCircleRoundedIcon />
          </Button>
        </Box>
      )}

      <Stack spacing={2} direction="row" justifyContent="flex-end" paddingTop={3}>
        <Button variant="text" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button variant="contained" type="submit">
          {t("validate")}
        </Button>
      </Stack>
    </form>
  );
};

export default FormTreeCardMutation;
