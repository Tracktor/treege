import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SimCardDownloadRoundedIcon from "@mui/icons-material/SimCardDownloadRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import useViewerJSONAction from "@/components/UI/ViewerJSONAction/useViewerJSONAction";

interface ViewerJSONProps {
  value: any;
  downloadedFileName?: string;
  onSave?(): void;
}

const ViewerJSONAction = ({ downloadedFileName = "export", onSave, value }: ViewerJSONProps) => {
  const { t } = useTranslation("button");
  const { getDownloadLink } = useViewerJSONAction();

  return (
    <Stack direction="row" spacing={2} justifyContent="center">
      <Tooltip title={t("downloadJSONFile")} enterDelay={1500} disableHoverListener={!value} arrow>
        <Box>
          <Button variant="outlined" href={getDownloadLink(value)} download={`${downloadedFileName}.json`} disabled={!value}>
            <SimCardDownloadRoundedIcon />
          </Button>
        </Box>
      </Tooltip>
      <Tooltip title={t("save")} enterDelay={1500} disableHoverListener={!value} arrow>
        <Box>
          <Button variant="outlined" onClick={onSave} disabled={!value}>
            <SaveRoundedIcon />
          </Button>
        </Box>
      </Tooltip>
    </Stack>
  );
};

export default ViewerJSONAction;
