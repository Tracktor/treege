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
  endPoint: {
    url: string;
    searchKey: string;
  };
}

const EndPointWarning = ({ endPoint }: EndPointWarningProps) => {
  const { t } = useTranslation(["translation", "form"]);
  const { url, searchKey } = endPoint;
  const fullUrl = `${url}?${searchKey}`;

  return (
    <Alert severity="warning" variant="outlined">
      <Typography component="div" variant="body2" gutterBottom sx={{ lineHeight: 2 }}>
        {t("form:warningApiAutocomplete.url")}{" "}
        {url && (
          <>
            <Box component="span" sx={styles.container}>
              {fullUrl}
            </Box>{" "}
          </>
        )}
        {t("form:warningApiAutocomplete.response")}
        <Box sx={styles.container}>
          {"{ "}
          <Box component="span" sx={styles.property}>
            label
          </Box>
          :{" "}
          <Box component="span" sx={styles.type}>
            string
          </Box>
          ;{" "}
          <Box component="span" sx={styles.property}>
            value
          </Box>
          :{" "}
          <Box component="span" sx={styles.type}>
            string
          </Box>
          ;{" "}
          <Box component="span" sx={styles.property}>
            img
          </Box>
          <Box component="span" className="semicolon">
            ?
          </Box>
          :{" "}
          <Box component="span" sx={styles.type}>
            string
          </Box>
          {"; }"}
        </Box>
      </Typography>
    </Alert>
  );
};

export default EndPointWarning;
