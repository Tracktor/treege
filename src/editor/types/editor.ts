import { Edge, Node } from "@xyflow/react";
import { AIConfig } from "@/editor/types/ai";
import { Flow } from "@/shared/types/node";

export interface TreegeEditorProps {
  /**
   * Default flow structure containing combined nodes and edges.
   * Note: Individual defaultNodes/defaultEdges props take precedence over this.
   */
  flow?: Flow | null;
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
  /**
   * AI configuration for tree generation
   */
  aiConfig?: AIConfig;
}
