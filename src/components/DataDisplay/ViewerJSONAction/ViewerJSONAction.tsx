import SaveAsRoundedIcon from "@mui/icons-material/SaveAsRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SimCardDownloadRoundedIcon from "@mui/icons-material/SimCardDownloadRounded";
import { Box, Button, Stack, Tooltip } from "@tracktor/design-system";
import { useTranslation } from "react-i18next";
import useViewerJSONAction from "@/components/DataDisplay/ViewerJSONAction/useViewerJSONAction";
import useTreegeContext from "@/hooks/useTreegeContext";

interface ViewerJSONProps {
  value: any;
  downloadedFileName?: string;
}

const ViewerJSONAction = ({ downloadedFileName = "export", value }: ViewerJSONProps) => {
  const { t } = useTranslation("button");
  const { getDownloadLink, handleSubmit } = useViewerJSONAction();
  const { currentTree, endPoint } = useTreegeContext();
  const { id } = currentTree;

  return (
    <Stack direction="row" spacing={2} justifyContent="center">
      <Tooltip title={t("downloadJSONFile")} enterDelay={1500} disableHoverListener={!value} arrow>
        <Box>
          <Button variant="outlined" href={getDownloadLink(value)} download={`${downloadedFileName}.json`} disabled={!value}>
            <SimCardDownloadRoundedIcon />
          </Button>
        </Box>
      </Tooltip>
      <Tooltip title={id ? t("update") : t("save")} enterDelay={1500} disableHoverListener={!value} arrow>
        <Box>
          <Button variant="outlined" onClick={handleSubmit} disabled={!value || !endPoint}>
            {id ? <SaveAsRoundedIcon /> : <SaveRoundedIcon />}
          </Button>
        </Box>
      </Tooltip>
    </Stack>
  );
};

export default ViewerJSONAction;
