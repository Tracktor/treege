import { json } from "@codemirror/lang-json";
import { GlobalStyles } from "@tracktor/design-system";
import { dracula } from "@uiw/codemirror-theme-dracula";
import CodeMirror from "@uiw/react-codemirror";
import useViewerJSON from "@/components/DataDisplay/ViewerJSON/useViewerJSON";

interface ViewerJSONProps {
  value: unknown;
  onChange?: (value: any) => void;
}

const styles = {
  fullHeight: {
    height: "100%",
  },
};

const ViewerJSON = ({ value, onChange }: ViewerJSONProps) => {
  const { formatJSON } = useViewerJSON();

  return (
    <div style={styles.fullHeight}>
      <GlobalStyles
        styles={{
          ".cm-activeLine.cm-line, .cm-gutterElement.cm-activeLineGutter": {
            backgroundColor: "transparent",
          },
        }}
      />
      <CodeMirror
        editable
        value={formatJSON(value)}
        extensions={[json()]}
        theme={dracula}
        height="100%"
        style={styles.fullHeight}
        onChange={onChange}
      />
    </div>
  );
};

export default ViewerJSON;
