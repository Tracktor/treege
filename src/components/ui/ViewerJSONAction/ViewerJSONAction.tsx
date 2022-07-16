import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SimCardDownloadRoundedIcon from "@mui/icons-material/SimCardDownloadRounded";
import { Button, Stack } from "@mui/material";
import useViewerJSONAction from "@/components/ui/ViewerJSONAction/useViewerJSONAction";

interface ViewerJSONProps {
  value: any;
  downloadedFileName?: string;
  onSave?(): void;
}

const ViewerJSONAction = ({ downloadedFileName = "export", onSave, value }: ViewerJSONProps) => {
  const { getDownloadLink } = useViewerJSONAction();

  return (
    <Stack direction="row" spacing={2} justifyContent="center">
      <Button variant="outlined" href={getDownloadLink(value)} download={`${downloadedFileName}.json`} disabled={!value}>
        <SimCardDownloadRoundedIcon />
      </Button>
      <Button variant="outlined" onClick={onSave} disabled={!value}>
        <SaveRoundedIcon />
      </Button>
    </Stack>
  );
};

export default ViewerJSONAction;
