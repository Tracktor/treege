import SaveAsRoundedIcon from "@mui/icons-material/SaveAsRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SimCardDownloadRoundedIcon from "@mui/icons-material/SimCardDownloadRounded";
import { Box, Button, Stack, Tooltip } from "design-system-tracktor";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import useViewerJSONAction from "@/components/DataDisplay/ViewerJSONAction/useViewerJSONAction";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";

interface ViewerJSONProps {
  value: any;
  downloadedFileName?: string;
}

const ViewerJSONAction = ({ downloadedFileName = "export", value }: ViewerJSONProps) => {
  const { t } = useTranslation("button");
  const { getDownloadLink, handleSubmit } = useViewerJSONAction();
  const { currentTree } = useContext(TreegeContext);
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
          <Button variant="outlined" onClick={handleSubmit} disabled={!value}>
            {id ? <SaveAsRoundedIcon /> : <SaveRoundedIcon />}
          </Button>
        </Box>
      </Tooltip>
    </Stack>
  );
};

export default ViewerJSONAction;
