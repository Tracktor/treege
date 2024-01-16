import { Alert, Box, Stack, Typography } from "@tracktor/design-system";
import { useTranslation } from "react-i18next";

const styles = {
  container: {
    backgroundColor: "#282c34",
    borderRadius: 1,
    color: "#abb2bf",
    paddingX: 1,
    paddingY: 1,
    width: "fit-content",
  },
  property: {
    color: "#56b6c2",
  },
  type: {
    color: "#c678dd",
  },
};
const EndPointWarning = () => {
  const { t } = useTranslation(["translation", "form"]);
  return (
    <Alert severity="warning" variant="outlined">
      <Stack alignItems="center">
        <Typography variant="body2" gutterBottom>
          {t("form:warningApiAutocomplete")}
        </Typography>
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
      </Stack>
    </Alert>
  );
};

export default EndPointWarning;
