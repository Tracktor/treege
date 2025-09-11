import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Typography, Accordion, AccordionSummary, AccordionDetails } from "@tracktor/design-system";
import type { DefaultValueFromAncestor, FieldType } from "@tracktor/types-treege";
import { useTranslation } from "react-i18next";
import AssignValueToChildren from "@/features/Treege/components/Forms/AssignValueToChildren/AssignValueToChildren";
import ReceiveValueFromAncestor from "@/features/Treege/components/Forms/ReceiveValueFromAncestor";

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

  return (
    <Accordion sx={{ marginY: 3 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-ancestor-control" id="panel-ancestor-control-header">
        <Typography variant="h5">{t("form:prefillField")}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <ReceiveValueFromAncestor id="receive-value" onChange={onChangeAncestorRef} value={selectAncestorName} ancestors={ancestors} />
        {selectAncestorName && (
          <AssignValueToChildren
            ancestorName={selectAncestorName}
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
