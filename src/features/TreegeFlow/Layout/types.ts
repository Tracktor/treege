import { Edge, Node } from "@xyflow/react";

export type NodeWithAttributes<T> = Node<
  T & {
    attributes?: {
      type?: string;
    };
  }
>;

export interface EngineLayoutOutput<T> {
  nodes: NodeWithAttributes<T>[];
  edges: Edge[];
}
