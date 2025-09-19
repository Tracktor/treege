export type NodeOptions = {
  name: string;
  label: string;
  value: string;
  type?: string;
  isDecision?: boolean;
  sourceHandle?: string;
};

export type MinimalNode = {
  id: string;
  attributes: NodeOptions;
  options: NodeOptions[];
};

export type MinimalEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
};

export type MinimalGraph = {
  nodes: MinimalNode[];
  edges: MinimalEdge[];
};

export type CustomNodeData = NodeOptions & {
  order?: number;
  onAddNode?: (parentId: string, childId?: string, options?: NodeOptions) => void;
  options?: NodeOptions[];
};
