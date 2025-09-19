export type Attributes = {
  name: string;
  label: string;
  value: string;
  type?: string;
  isDecision?: boolean;
  sourceHandle?: string;
};

export type MinimalNode = {
  id: string;
  attributes: Attributes;
  children: Attributes[];
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

export type CustomNodeData = Attributes & {
  order?: number;
  onAddNode?: (parentId: string, childId?: string, attributes?: Attributes) => void;
  children?: Attributes[];
};
