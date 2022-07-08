import { json } from "@codemirror/lang-json";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import { Button, Stack } from "@mui/material";
import { dracula } from "@uiw/codemirror-theme-dracula";
import CodeMirror from "@uiw/react-codemirror";
import styles from "./ViewerJSON.module.scss";
import useViewerJSON from "@/components/ui/ViewerJSON/useViewerJSON";

interface ViewerJSONProps {
  value: any;
  downloadedFileName?: string;
  onSave?(): void;
}

const ViewerJSON = ({ downloadedFileName = "export", onSave, value }: ViewerJSONProps) => {
  const { formatJSON, getDownloadLink } = useViewerJSON();

  return (
    <div className={styles.Container}>
      <CodeMirror
        value={formatJSON(value)}
        extensions={[json()]}
        editable={false}
        theme={dracula}
        height="100%"
        className={styles.Viewer}
      />
      <Stack direction="row" spacing={1} pt={1} justifyContent="flex-end">
        <Button variant="outlined" href={getDownloadLink(value)} download={`${downloadedFileName}.json`}>
          Télécharger
        </Button>
        <Button variant="outlined" onClick={onSave}>
          <SaveOutlined />
        </Button>
      </Stack>
    </div>
  );
};

export default ViewerJSON;
