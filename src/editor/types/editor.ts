import { Edge, Node } from "@xyflow/react";
import { Flow } from "@/shared/types/node";

export interface TreegeEditorProps {
  /**
   * Default flow structure containing combined nodes and edges.
   * Note: Individual defaultNodes/defaultEdges props take precedence over this.
   */
  flow?: Flow;
  /**
   * Default nodes to initialize the nodes in the flow.
   */
  nodes?: Node[];
  /**
   * Default edges to initialize the edges in the flow.
   */
  edges?: Edge[];
  /**
   * Callback function triggered when exporting JSON data.
   */
  onExportJson?: () => { nodes: Node[]; edges: Edge[] } | undefined;
  /**
   * Callback function triggered when saving the flow data.
   * @param data
   */
  onSave?: (data: Flow) => void;
  /**
   * Theme for the editor interface.
   */
  theme?: "dark" | "light";
  /**
   * Language for the editor interface.
   */
  language?: string;
}
