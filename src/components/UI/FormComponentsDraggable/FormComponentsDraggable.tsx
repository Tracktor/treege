import { TextField, Checkbox, Stack, Select, MenuItem, Radio, FormControl, RadioGroup, FormControlLabel } from "@mui/material";

const FormComponentsDraggable = () => (
  <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={3}>
    <FormControl disabled fullWidth>
      <TextField value="text" />
    </FormControl>

    <FormControl disabled fullWidth>
      <Select value="select">
        <MenuItem value={1}>Option 1</MenuItem>
        <MenuItem value={2}>Option 2</MenuItem>
        <MenuItem value={3}>Option 3</MenuItem>
      </Select>
    </FormControl>

    <FormControl disabled>
      <RadioGroup>
        <FormControlLabel value="checkbox" control={<Checkbox disabled />} label="Checkbox" />
      </RadioGroup>
    </FormControl>

    <FormControl disabled>
      <RadioGroup>
        <FormControlLabel value="radio" control={<Radio />} label="Radio" />
      </RadioGroup>
    </FormControl>
  </Stack>
);

export default FormComponentsDraggable;
