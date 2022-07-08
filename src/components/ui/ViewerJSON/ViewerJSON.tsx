import { json } from "@codemirror/lang-json";
import { dracula } from "@uiw/codemirror-theme-dracula";
import CodeMirror from "@uiw/react-codemirror";
import styles from "./ViewerJSON.module.scss";
import useViewerJSON from "@/components/ui/ViewerJSON/useViewerJSON";

interface ViewerJSONProps {
  value: any;
}

const ViewerJSON = ({ value }: ViewerJSONProps) => {
  const { formatJSON } = useViewerJSON();

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
    </div>
  );
};

export default ViewerJSON;
