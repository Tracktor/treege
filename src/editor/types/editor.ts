import { Edge, Node } from "@xyflow/react";

export interface TreegeEditorProps {
  /**
   * Default nodes to initialize the nodes in the flow.
   */
  defaultNodes?: Node[];
  /**
   * Default edges to initialize the edges in the flow.
   */
  defaultEdges?: Edge[];
  /**
   * Default flow structure containing combined nodes and edges.
   * Note: Individual defaultNodes/defaultEdges props take precedence over this.
   */
  defaultFlow?: { nodes: Node[]; edges: Edge[] };
  /**
   * Callback function triggered when exporting JSON data.
   */
  onExportJson?: () => { nodes: Node[]; edges: Edge[] } | undefined;
  /**
   * Callback function triggered when saving the flow data.
   * @param data
   */
  onSave?: (data: { nodes: Node[]; edges: Edge[] }) => void;

  /**
   * Theme for the editor interface.
   */
  theme?: "dark" | "light";
}
