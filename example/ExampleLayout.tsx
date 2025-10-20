import { Edge, Node } from "@xyflow/react";
import { MoonStar, Sun } from "lucide-react";
import { useState } from "react";
import TreegeEditor from "@/editor/features/TreegeEditor/TreegeEditor";
import { FormValues, TreegeRenderer } from "@/renderer";
import { Switch } from "@/shared/components/ui/switch";

const EditorPanel = ({
  defaultFlow,
  onSave,
  theme,
}: {
  defaultFlow?: { nodes: Node[]; edges: Edge[] };
  onSave: (data: { nodes: Node[]; edges: Edge[] }) => void;
  theme: "light" | "dark";
}) => (
  <div className="h-full flex flex-col">
    <div className="flex-1">
      <TreegeEditor onSave={onSave} defaultFlow={defaultFlow} theme={theme} />
    </div>
  </div>
);

const RendererPanel = ({
  nodes,
  edges,
  theme,
  setTheme,
}: {
  nodes: Node[];
  edges: Edge[];
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
}) => {
  const [formValues, setFormValues] = useState<FormValues>({});
  const hasNodes = nodes.length > 0;

  const handleSubmit = (values: Record<string, any>) => {
    console.log("Form submitted:", values);
    // eslint-disable-next-line no-alert
    alert(`Form submitted!\n\n${JSON.stringify(values, null, 2)}`);
  };

  return (
    <div className={`h-full flex flex-col bg-background ${theme}`}>
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Form Preview</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {nodes.length > 0 ? `${nodes.length} nodes, ${edges.length} edges` : "Save to see the render"}
          </p>
        </div>
        {hasNodes && (
          <div className="flex gap-2 items-center">
            <Sun size={15} />
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => {
                setTheme(checked ? "dark" : "light");
              }}
            />
            <MoonStar size={15} />
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto p-6">
        {hasNodes ? (
          <>
            <TreegeRenderer
              nodes={nodes}
              edges={edges}
              theme={theme}
              onSubmit={handleSubmit}
              onChange={setFormValues}
              validationMode="onSubmit"
              language="en"
            />
            <div className="mt-8 p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Current values:</h3>
              <pre className="text-xs p-2 rounded overflow-auto">{JSON.stringify(formValues, null, 2)}</pre>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg">No form to display</p>
              <p className="text-sm mt-2">Create your form in the editor and click &quot;Save&quot;</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ExampleLayout = ({ defaultFlow }: { defaultFlow?: { nodes: Node[]; edges: Edge[] } }) => {
  const [savedNodes, setSavedNodes] = useState<Node[]>([]);
  const [savedEdges, setSavedEdges] = useState<Edge[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const handleSave = ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
    setSavedNodes(nodes);
    setSavedEdges(edges);
  };

  return (
    // <ThemeProvider theme={theme}>
    <div className="h-screen w-screen flex">
      <div className="w-1/2 border-r">
        <EditorPanel onSave={handleSave} defaultFlow={defaultFlow} theme={theme} />
      </div>
      <div className="w-1/2">
        <RendererPanel nodes={savedNodes} edges={savedEdges} theme={theme} setTheme={setTheme} />
      </div>
    </div>
    // </ThemeProvider>
  );
};

export default ExampleLayout;
