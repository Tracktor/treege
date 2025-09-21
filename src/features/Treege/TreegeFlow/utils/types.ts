export type Attributes = {
  name: string;
  label: string;
  value: string;
  type?: string;
  isDecision?: boolean;
  sourceHandle?: string;
  message?: string;
};

export type MinimalNode = {
  uuid: string;
  attributes: Attributes;
  children: MinimalNode[];
};

export type MinimalEdge = {
  uuid: string;
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
  children?: MinimalNode[];
};
