import SaveOutlined from "@mui/icons-material/SaveOutlined";
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
      <Button variant="outlined" href={getDownloadLink(value)} download={`${downloadedFileName}.json`}>
        Télécharger
      </Button>
      <Button variant="outlined" onClick={onSave}>
        <SaveOutlined />
      </Button>
    </Stack>
  );
};

export default ViewerJSONAction;
