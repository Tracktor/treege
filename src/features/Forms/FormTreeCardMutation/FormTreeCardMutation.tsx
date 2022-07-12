import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import useFormTreeCardMutation from "@/features/Forms/FormTreeCardMutation/useFormTreeCardMutation";

interface FormTreeCardMutationProps {
  onClose?(): void;
}

const FormTreeCardMutation = ({ onClose }: FormTreeCardMutationProps) => {
  const {
    values,
    required,
    disabled,
    handleChangeRequired,
    handleChangeDisabled,
    handleChangeName,
    name,
    type,
    handleChangeType,
    handleChangeLabel,
    handleChangeValue,
    handleSubmit,
  } = useFormTreeCardMutation();

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing={1} paddingY={1}>
        <TextField
          label="Nom"
          variant="outlined"
          sx={{ flex: 1 }}
          onChange={handleChangeName}
          value={name}
          helperText="Doit être unique"
          required
        />

        <FormControl sx={{ flex: 1 }} required>
          <InputLabel>Type</InputLabel>
          <Select value={type} label="Age" onChange={handleChangeType}>
            <MenuItem value="select">Select</MenuItem>
            <MenuItem value="text">Champ de text</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {values?.map(({ value, label, id }) => (
        <Stack direction="row" spacing={1} paddingY={1} key={id}>
          <TextField
            label="Label"
            variant="outlined"
            sx={{ flex: 1 }}
            onChange={handleChangeLabel}
            value={label}
            inputProps={{ "data-id": id }}
            required
          />
          <TextField
            label="Valeur"
            variant="outlined"
            sx={{ flex: 1 }}
            onChange={handleChangeValue}
            value={value}
            inputProps={{ "data-id": id }}
            required
          />
        </Stack>
      ))}

      <FormGroup>
        <FormControlLabel control={<Checkbox checked={required} onChange={handleChangeRequired} />} label="Requis" />
      </FormGroup>

      <FormGroup>
        <FormControlLabel control={<Checkbox checked={disabled} onChange={handleChangeDisabled} />} label="Désactivé" />
      </FormGroup>

      <Stack spacing={2} direction="row" justifyContent="flex-end">
        <Button variant="text" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="contained" type="submit">
          Ajouter
        </Button>
      </Stack>
    </form>
  );
};

export default FormTreeCardMutation;
