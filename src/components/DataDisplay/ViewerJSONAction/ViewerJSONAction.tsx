import FileCopyRoundedIcon from "@mui/icons-material/FileCopyRounded";
import RotateLeftRoundedIcon from "@mui/icons-material/RotateLeftRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SimCardDownloadRoundedIcon from "@mui/icons-material/SimCardDownloadRounded";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Tooltip,
} from "@tracktor/design-system";
import { useTranslation } from "react-i18next";
import useViewerJSONAction from "@/components/DataDisplay/ViewerJSONAction/useViewerJSONAction";
import useTreegeContext from "@/hooks/useTreegeContext";

interface ViewerJSONProps {
  value: any;
  downloadedFileName?: string;
}

const ViewerJSONAction = ({ downloadedFileName = "export", value }: ViewerJSONProps) => {
  const { t } = useTranslation();
  const { getDownloadLink, handleSubmit, handleClose, handleOpen, handleResetTree, copyToClipboard, openModal } = useViewerJSONAction();
  const { currentTree, backendConfig, tree } = useTreegeContext();
  const { id } = currentTree;

  return (
    <Stack direction="row" spacing={1} justifyContent="center">
      <Tooltip title={t("resetTree", { ns: "button" })} enterDelay={1500} disableHoverListener={!value} arrow>
        <Box>
          <IconButton disabled={!tree} onClick={handleOpen} color="warning">
            <RotateLeftRoundedIcon />
          </IconButton>
        </Box>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      <Tooltip title={t("copyToClipboard", { ns: "button" })} enterDelay={1500} disableHoverListener={!value} arrow>
        <Box>
          <IconButton disabled={!value} onClick={copyToClipboard(value)}>
            <FileCopyRoundedIcon />
          </IconButton>
        </Box>
      </Tooltip>
      <Tooltip title={t("downloadJSONFile", { ns: "button" })} enterDelay={1500} disableHoverListener={!value} arrow>
        <Box>
          <IconButton href={getDownloadLink(value)} download={`${downloadedFileName}.json`} disabled={!value}>
            <SimCardDownloadRoundedIcon />
          </IconButton>
        </Box>
      </Tooltip>
      <Tooltip
        title={id ? t("update", { ns: "button" }) : t("save", { ns: "button" })}
        enterDelay={1500}
        disableHoverListener={!value}
        arrow
      >
        <Box>
          <IconButton onClick={handleSubmit} disabled={!value || !backendConfig?.baseUrl}>
            <SaveRoundedIcon />
          </IconButton>
        </Box>
      </Tooltip>
      <Dialog maxWidth="xs" fullWidth open={openModal} onClose={handleClose}>
        <DialogTitle variant="h3">{t("resetTree", { ns: "button" })}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("resetTreeContent", { ns: "modal" })}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("close", { ns: "button" })}</Button>
          <Button variant="contained" color="warning" onClick={handleResetTree}>
            {t("reset", { ns: "button" })}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ViewerJSONAction;
