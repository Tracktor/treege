import {
  Box,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@tracktor/design-system";
import { useState } from "react";

const demoObject = {
  address: {
    city: "Paris",
    countryCode: "FR",
    route: "Rue Saint-Sabin",
    streetNumber: "6",
    zipcode: "75011",
  },
  entityId: "0",
  id: "0",
  internalCode: "B11X.PE0138",
  name: "worksite-0",
};

const extractAllKeys = (obj: Record<string, any>, keys = new Set<string>()): string[] => {
  Object.keys(obj).forEach((key) => {
    keys.add(key);
    const value = obj[key];
    if (value !== null && typeof value === "object") {
      extractAllKeys(value, keys);
    }
  });
  return Array.from(keys);
};

const findKeyPath = (obj: Record<string, any>, targetKey: string, path = ""): string | null => {
  let foundPath: string | null = null;

  Object.keys(obj).some((key) => {
    const newPath = path ? `${path}.${key}` : key;

    if (key === targetKey) {
      foundPath = newPath;
      return true;
    }

    const value = obj[key];
    if (value !== null && typeof value === "object") {
      const result = findKeyPath(value, targetKey, newPath);
      if (result) {
        foundPath = result;
        return true;
      }
    }

    return false;
  });

  return foundPath;
};

const ObjectMappingExample = () => {
  const [inputKey, setInputKey] = useState("");
  const [outputPath, setOutputPath] = useState("");

  const allKeys = extractAllKeys(demoObject);

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const key = event.target.value;
    setInputKey(key);
    const path = findKeyPath(demoObject, key);
    setOutputPath(path || "");
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">🔑 Pick a key</Typography>
          <FormControl fullWidth>
            <InputLabel>Choisir une clé</InputLabel>
            <Select value={inputKey} label="Choisir une clé" onChange={handleSelectChange}>
              {allKeys.map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="h6">Map to value desired 🔑</Typography>
          <TextField label="Chemin complet" variant="outlined" value={outputPath} />

          <Typography variant="h6">API model example:</Typography>
          <Box component="pre" sx={{ borderRadius: 2 }}>
            {JSON.stringify(demoObject, null, 2)}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ObjectMappingExample;
