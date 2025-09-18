export type Attributes = {
  key: string;
  value: string;
};

export type NodeOptions = {
  name?: string;
  type?: string;
  isDecision?: boolean;
  sourceHandle?: string;
  attributes?: Attributes[];
};

export type MinimalNode = {
  id: string;
  data: NodeOptions;
  type?: string;
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
