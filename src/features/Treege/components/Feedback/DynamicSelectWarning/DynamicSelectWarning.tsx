import { Alert, Box, Typography } from "@tracktor/design-system";
import { useTranslation } from "react-i18next";

const styles = {
  container: {
    backgroundColor: "#282c34",
    borderRadius: 0.5,
    color: "#abb2bf",
    display: "inline-block",
    lineHeight: 1.5,
    marginBottom: 0.2,
    paddingX: 0.5,
    paddingY: 0.2,
    width: "fit-content",
  },
  property: {
    color: "#56b6c2",
  },
  type: {
    color: "#c678dd",
  },
};

interface EndPointWarningProps {
  value: string | null;
}

const DynamicSelectWarning = ({ value }: EndPointWarningProps) => {
  const { t } = useTranslation(["translation", "form"]);

  return (
    <Alert severity="warning" variant="outlined">
      <Typography variant="body2">
        {t("form:warningApiSelect.url")} {t("form:warningApiSelect.warning")} {t("form:warningApiSelect.response")}
        <Box sx={styles.container}>
          https://api.com/text={"{{"}
          <Box component="span" sx={styles.type}>
            {value || "value"}
          </Box>
          {"}}"} <Box component="span" sx={styles.property} />
        </Box>
      </Typography>
    </Alert>
  );
};

export default DynamicSelectWarning;
