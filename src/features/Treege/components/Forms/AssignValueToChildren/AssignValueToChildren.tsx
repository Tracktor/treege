import { Typography, Alert, Grid2, TextField, Checkbox, FormControlLabel, Box, Divider, Collapse } from "@tracktor/design-system";
import type { DefaultValueFromAncestor } from "@tracktor/types-treege";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import ObjectMappingExample from "@/features/Treege/components/Forms/AssignValueToChildren/Examples/ObjectMappingExample";
import useTreegeContext from "@/hooks/useTreegeContext";
import { getNode } from "@/utils/tree";

interface AssignValueToChildrenProps {
  value?: DefaultValueFromAncestor | null;
  onChange?: (sourceValue?: string) => void;
  ancestorName: string;
  currentTypeField?: string;
}

const ObjectType = ["address", "dynamicSelect", "autocomplete"];

const AssignValueToChildren = ({ onChange, value, ancestorName, currentTypeField }: AssignValueToChildrenProps) => {
  const { t } = useTranslation(["form"]);
  const { tree } = useTreegeContext();
  const node = tree && getNode(tree, null, value?.uuid || "");
  const ancestorType = node?.attributes?.type || "";
  const [openObjectMappingExample, setOpenObjectMappingExample] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const { sourceValue } = value || {};

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    onChange?.(newText);
  };

  const renderAlertContent = () => {
    if (currentTypeField === "address") {
      return (
        <>
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
        </>
      );
    }

    if (currentTypeField === "dynamicSelect") {
      return (
        <>
          <Typography variant="subtitle2" gutterBottom>
            {t("dynamicSelectStructureHint")}
          </Typography>
          <Box component="pre" sx={{ borderRadius: 2, p: 2 }}>
            {JSON.stringify(
              {
                value: "string",
              },
              null,
              2,
            )}
          </Box>
        </>
      );
    }

    if (currentTypeField === "select" || currentTypeField === "radio") {
      return (
        <Typography variant="subtitle2" gutterBottom>
          {t("selectStructureHint")}
        </Typography>
      );
    }

    return <Typography variant="body2">{t("typeStructureWarning", { type: currentTypeField })}</Typography>;
  };

  return (
    <Grid2 container>
      <Grid2 size={12}>
        <Typography variant="h5" gutterBottom>
          {t("ancestorValue", { ancestorName })}
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Input type: <strong>{ancestorType}</strong>
        </Typography>

        <Divider sx={{ my: 2 }} />

        {ObjectType.includes(ancestorType || "") && (
          <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="body2" gutterBottom>
              a
            </Typography>
            <TextField fullWidth label={t("keyPathObject")} value={sourceValue ?? ""} onChange={handleTextChange} />

            <FormControlLabel
              control={
                <Checkbox
                  id="isRequired"
                  checked={openObjectMappingExample}
                  onChange={() => setOpenObjectMappingExample((prev) => !prev)}
                />
              }
              label={t("objectDemo")}
            />

            <Collapse in={openObjectMappingExample}>
              <Box mt={1}>
                <ObjectMappingExample />
              </Box>
            </Collapse>

            <Typography>
              Output type: <strong>{currentTypeField}</strong>
            </Typography>

            <Typography>{t("keyPathAssignment", { keyPath: sourceValue || "" })}</Typography>

            <Alert severity="warning" variant="outlined">
              {renderAlertContent()}
            </Alert>
          </Box>
        )}

        {["text", "number", "email", "tel", "url", "switch", "checkbox", "radio", "select"].includes(ancestorType || "") && (
          <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="body2">{t("staticValueDescription")}</Typography>
            {["text", "number", "email", "tel", "url"].includes(currentTypeField || "") && (
              <TextField fullWidth label={t("staticValue")} value={sourceValue ?? ""} onChange={handleTextChange} />
            )}

            {["switch", "checkbox"].includes(currentTypeField || "") && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isChecked}
                    onChange={() => {
                      setIsChecked((prev) => !prev);
                      onChange?.(isChecked ? undefined : "true");
                    }}
                  />
                }
                label={t("staticValue")}
              />
            )}

            {["select", "radio"].includes(currentTypeField || "") && (
              <TextField fullWidth label={t("staticValue")} value={sourceValue ?? ""} onChange={handleTextChange} />
            )}

            <Typography>
              Output type: <strong>{currentTypeField}</strong>
            </Typography>

            <Alert severity="warning" variant="outlined">
              {renderAlertContent()}
            </Alert>
          </Box>
        )}
      </Grid2>
    </Grid2>
  );
};

export default AssignValueToChildren;
