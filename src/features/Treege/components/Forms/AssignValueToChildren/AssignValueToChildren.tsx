import { KeyboardArrowDown } from "@mui/icons-material";
import {
  Typography,
  Alert,
  Grid2,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Divider,
  Collapse,
  IconButton,
  Stack,
} from "@tracktor/design-system";
import type { DefaultValueFromAncestor } from "@tracktor/types-treege";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import ObjectMappingExample from "@/features/Treege/components/Forms/AssignValueToChildren/Examples/ObjectMappingExample";
import useTreegeContext from "@/hooks/useTreegeContext";
import { findNodeByUUIDInTree } from "@/utils/tree";

interface AssignValueToChildrenProps {
  value?: DefaultValueFromAncestor | null;
  onChange?: (sourceValue?: string) => void;
  ancestorName: string;
  displayTopDivider?: boolean;
  currentType?: string;
}

const ObjectType = ["address", "dynamicSelect", "autocomplete"];

const AssignValueToChildren = ({ onChange, value, ancestorName, displayTopDivider, currentType }: AssignValueToChildrenProps) => {
  const { t } = useTranslation(["form"]);
  const { tree } = useTreegeContext();
  const node = findNodeByUUIDInTree(tree, value?.uuid || "");

  const ancestorType = node?.attributes?.type || "";
  const [openObjectMappingExample, setOpenObjectMappingExample] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const { sourceValue } = value || {};

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    onChange?.(newText);
  };

  const renderAlertContent = () => {
    if (currentType === "address") {
      return (
        <Alert severity="warning" variant="outlined">
          <Typography variant="subtitle2" gutterBottom>
            {t("addressStructureHint")}
          </Typography>
          <Box component="pre" sx={{ borderRadius: 2, p: 2 }}>
            {JSON.stringify(
              {
                city: "string",
                country: "string",
                postalCode: "string",
                state: "string",
                street: "string",
              },
              null,
              2,
            )}
          </Box>
        </Alert>
      );
    }

    if (currentType === "dynamicSelect") {
      return (
        <Alert severity="warning" variant="outlined">
          <Typography variant="subtitle2" gutterBottom>
            {t("dynamicSelectStructureHint")}
          </Typography>
        </Alert>
      );
    }

    if (currentType === "select" || ancestorType === "radio") {
      return (
        <Alert severity="warning" variant="outlined">
          <Typography variant="subtitle2" gutterBottom>
            {t("selectStructureHint")}
          </Typography>
        </Alert>
      );
    }

    return null;
  };

  return (
    <Grid2 container>
      <Grid2 size={12} pt={2}>
        {displayTopDivider && <Divider sx={{ my: 2 }} />}
        <Typography variant="h5" gutterBottom>
          {t("ancestorValue", { ancestorName })}
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Input type: <strong>{ancestorType}</strong>
        </Typography>

        {ObjectType.includes(ancestorType || "") && (
          <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Stack spacing={1}>
              <Typography>{t("mapObject")}</Typography>
              <TextField fullWidth label={t("keyPathObject")} value={sourceValue ?? ""} onChange={handleTextChange} />
            </Stack>

            <FormControlLabel
              control={
                <IconButton
                  onClick={() => setOpenObjectMappingExample((prev) => !prev)}
                  sx={{
                    transform: openObjectMappingExample ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                  }}
                >
                  <KeyboardArrowDown />
                </IconButton>
              }
              label={t("objectDemo")}
            />

            <Collapse in={openObjectMappingExample}>
              <Box mt={1}>
                <ObjectMappingExample />
              </Box>
            </Collapse>

            <Typography>
              Output type: <strong>{currentType}</strong>
            </Typography>

            {renderAlertContent()}
          </Box>
        )}

        {["text", "number", "email", "tel", "url", "switch", "checkbox", "radio", "select", "date"].includes(ancestorType || "") && (
          <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="body2">{t("staticValueDescription")}</Typography>
            {!["switch", "checkbox"].includes(ancestorType || "") && (
              <TextField fullWidth label={t("staticValue")} value={sourceValue ?? ""} onChange={handleTextChange} />
            )}

            {["switch", "checkbox"].includes(ancestorType || "") && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) => {
                      const { checked } = e.target;

                      setIsChecked(checked);
                      onChange?.(checked ? String(checked) : undefined);
                    }}
                  />
                }
                label={t("staticValue")}
              />
            )}

            {renderAlertContent()}
          </Box>
        )}
      </Grid2>
    </Grid2>
  );
};

export default AssignValueToChildren;
