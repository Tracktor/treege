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
  FormControl,
} from "@tracktor/design-system";
import type { DefaultValueFromAncestor, FieldType } from "@tracktor/types-treege";
import { useTranslation } from "react-i18next";
import AssignValueToChildren from "@/features/TreegeTree/components/Forms/AssignValueToChildren/AssignValueToChildren";
import useTreegeContext from "@/hooks/useTreegeContext";

interface FillerFieldAccordionProps {
  selectAncestorName?: string;
  type: FieldType;
  ancestors: { uuid: string; name?: string }[];
  defaultValueFromAncestor?: DefaultValueFromAncestor;
  onChangeValueFromAncestor?: (sourceValue?: string) => void;
  onChangeAncestorRef?: (ancestorUuid?: string, ancestorName?: string) => void;
}

const FillerFieldAccordion = ({
  selectAncestorName,
  type,
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
    <Stack marginY={3}>
      <FormControl fullWidth variant="outlined" size="small">
        <InputLabel id="label-receive-value">{t("form:receiveValueFromParent")}</InputLabel>
        <Select
          labelId="label-receive-value"
          id="select-receive-value"
          value={selectAncestorName || ""}
          onChange={handleChange}
          label={t("form:receiveValueFromParent")}
          sx={{ borderBottomLeftRadius: selectAncestorName ? 0 : undefined, borderBottomRightRadius: selectAncestorName ? 0 : undefined }}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 300 },
            },
          }}
        >
          {ancestors.length > 0 ? (
            [
              <MenuItem key="empty" value="">
                &nbsp;
              </MenuItem>,
              ...ancestors.map(({ name }) => (
                <MenuItem key={`${name}-${uuid}`} value={name}>
                  {name}
                </MenuItem>
              )),
            ]
          ) : (
            <MenuItem disabled value="">
              {t("form:noAncestorFound")}
            </MenuItem>
          )}
        </Select>
      </FormControl>

      {selectAncestorName && (
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-ancestor-control" id="panel-ancestor-control-header">
            <Typography variant="h5">{t("advancedConfiguration")}</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <AssignValueToChildren onChange={onChangeValueFromAncestor} value={defaultValueFromAncestor} currentType={type} />
          </AccordionDetails>
        </Accordion>
      )}
    </Stack>
  );
};

export default FillerFieldAccordion;
