import { json } from "@codemirror/lang-json";
import { GlobalStyles } from "@tracktor/design-system";
import { dracula } from "@uiw/codemirror-theme-dracula";
import CodeMirror from "@uiw/react-codemirror";
import useViewerJSON from "@/components/DataDisplay/ViewerJSON/useViewerJSON";

interface ViewerJSONProps {
  value: any;
}

const styles = {
  fullHeight: {
    height: "100%",
  },
};

const ViewerJSON = ({ value }: ViewerJSONProps) => {
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
        value={formatJSON(value)}
        extensions={[json()]}
        editable={false}
        theme={dracula}
        height="100%"
        style={styles.fullHeight}
      />
    </div>
  );
};

export default ViewerJSON;
