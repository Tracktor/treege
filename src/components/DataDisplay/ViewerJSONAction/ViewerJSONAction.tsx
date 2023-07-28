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
  const { getDownloadLink, handleSubmit, handleClose, handleOpen, handleResetTree, openModal } = useViewerJSONAction();
  const { currentTree, endPoint, tree } = useTreegeContext();
  const { id } = currentTree;

  return (
    <Stack direction="row" spacing={2} justifyContent="center">
      <Tooltip title={t("resetTree", { ns: "button" })} enterDelay={1500} disableHoverListener={!value} arrow>
        <Box>
          <Button disabled={!tree} onClick={handleOpen} variant="outlined" color="warning">
            <RotateLeftRoundedIcon />
          </Button>
        </Box>
      </Tooltip>
      <Divider orientation="vertical" flexItem />
      <Tooltip title={t("downloadJSONFile", { ns: "button" })} enterDelay={1500} disableHoverListener={!value} arrow>
        <Box>
          <Button variant="outlined" href={getDownloadLink(value)} download={`${downloadedFileName}.json`} disabled={!value}>
            <SimCardDownloadRoundedIcon />
          </Button>
        </Box>
      </Tooltip>
      <Tooltip
        title={id ? t("update", { ns: "button" }) : t("save", { ns: "button" })}
        enterDelay={1500}
        disableHoverListener={!value}
        arrow
      >
        <Box>
          <Button variant="outlined" onClick={handleSubmit} disabled={!value || !endPoint}>
            <SaveRoundedIcon />
          </Button>
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
