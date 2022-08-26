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
} from "design-system";
import { useTranslation } from "react-i18next";
import styles from "./FormTreeCardMutation.module.scss";
import fields from "@/constants/fields";
import useFormTreeCardMutation from "@/features/Forms/FormTreeCardMutation/useFormTreeCardMutation";

interface FormTreeCardMutationProps {
  onClose?(): void;
}

const FormTreeCardMutation = ({ onClose }: FormTreeCardMutationProps) => {
  const { t } = useTranslation(["translation", "form"]);

  const {
    values,
    required,
    name,
    type,
    step,
    label,
    isDecision,
    isDecisionField,
    isRequiredDisabled,
    handleChangeRequired,
    handleChangeName,
    handleChangeType,
    handleChangeIsDecisionField,
    handleChangeOptionLabel,
    handleDeleteValue,
    handleChangeOptionValue,
    handleSubmit,
    handleAddValue,
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
            {fields.map(({ type: fieldsType }) => (
              <MenuItem key={fieldsType} value={fieldsType}>
                {t(`type.${fieldsType}`, { ns: "form" })}
              </MenuItem>
            ))}
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

      <Stack paddingY={1}>
        <FormGroup>
          <FormControlLabel
            disabled={isRequiredDisabled}
            control={<Checkbox checked={required} onChange={handleChangeRequired} />}
            label={t("required")}
          />
        </FormGroup>
        <FormGroup>
          <FormControlLabel
            disabled={!isDecisionField}
            control={<Checkbox checked={isDecision} onChange={handleChangeIsDecisionField} />}
            label={t("decisionField", { ns: "form" })}
          />
        </FormGroup>
      </Stack>

      {isDecisionField && (
        <>
          <h4>{t("values")}</h4>
          {values?.map(({ value, label: labelOption, id }) => (
            <Stack direction={{ sm: "row", xs: "column" }} spacing={1} paddingY={1} key={id} position="relative">
              <TextField
                label="Label"
                sx={{ flex: 1 }}
                onChange={handleChangeOptionLabel}
                value={labelOption}
                inputProps={{ "data-id": id }}
                required
              />
              <TextField
                label="Valeur"
                sx={{ flex: 1 }}
                onChange={handleChangeOptionValue}
                value={value}
                inputProps={{ "data-id": id }}
                required
              />
              {values.length > 1 && (
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
