import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  SelectChangeEvent,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@tracktor/design-system";
import type { DefaultValueFromAncestor, FieldType } from "@tracktor/types-treege";
import { useTranslation } from "react-i18next";
import AssignValueToChildren from "@/features/Treege/components/Forms/AssignValueToChildren/AssignValueToChildren";
import useTreegeContext from "@/hooks/useTreegeContext";

interface FillerFieldAccordionProps {
  selectAncestorName?: string;
  type: FieldType;
  isAutocomplete: boolean;
  isDynamicSelect: boolean;
  ancestors: { uuid: string; name?: string }[];
  defaultValueFromAncestor?: DefaultValueFromAncestor;
  onChangeValueFromAncestor?: (sourceValue?: string) => void;
  onChangeAncestorRef?: (ancestorUuid?: string, ancestorName?: string) => void;
}

const FillerFieldAccordion = ({
  selectAncestorName,
  type,
  isDynamicSelect,
  isAutocomplete,
  ancestors,
  defaultValueFromAncestor,
  onChangeValueFromAncestor,
  onChangeAncestorRef,
}: FillerFieldAccordionProps) => {
  const { t } = useTranslation(["translation", "form"]);
  const { tree, currentHierarchyPointNode } = useTreegeContext();
  const { uuid } = currentHierarchyPointNode?.data || {};

  if (!tree || !uuid) {
    return null;
  }

  const handleChange = (event: SelectChangeEvent<string | undefined>) => {
    const { value: newValue } = event.target;
    const selectedAncestor = ancestors.find((a) => a.name === newValue);
    const selectedUuid = selectedAncestor?.uuid;

    onChangeAncestorRef?.(selectedUuid, newValue);
  };

  return (
    <Accordion sx={{ marginY: 3 }} disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-ancestor-control" id="panel-ancestor-control-header">
        <Typography variant="h5">{t("form:prefillField")}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={1} pb={2} pt={3}>
          <InputLabel> {t("form:receiveValueFromParent")}</InputLabel>
          <Select
            id="label-receive-value"
            labelId="label-receive-value"
            variant="outlined"
            size="xSmall"
            value={selectAncestorName || ""}
            onChange={handleChange}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 300 },
              },
            }}
          >
            {ancestors.length && <MenuItem value="">&nbsp;</MenuItem>}

            {ancestors.length ? (
              ancestors.map(({ name }) => (
                <MenuItem key={`${name}-${uuid}`} value={name}>
                  {name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                {t("form:noAncestorFound")}
              </MenuItem>
            )}
          </Select>
        </Stack>

        {selectAncestorName && (
          <AssignValueToChildren
            onChange={onChangeValueFromAncestor}
            value={defaultValueFromAncestor}
            displayTopDivider={isAutocomplete || isDynamicSelect}
            currentType={type}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default FillerFieldAccordion;
