import { Edge, Node } from "@xyflow/react";
import ExampleLayout from "~/example/ExampleLayout";
import example from "~/example/json/example.json";

const Example = () => <ExampleLayout defaultFlow={example as { nodes: Node[]; edges: Edge[] }} />;

export default Example;
