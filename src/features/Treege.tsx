import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useCallback } from "react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
  { data: { label: "Node 1" }, id: "n1", position: { x: 0, y: 0 } },
  { data: { label: "Node 2" }, id: "n2", position: { x: 0, y: 100 } },
];

const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

const Treege = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)), [setEdges]);

  return (
    <ReactFlowProvider>
      <div style={{ height: "100vh", width: "100vw" }}>
        <ReactFlow
          fitView
          colorMode="dark"
          className="bg-teal-50"
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <Background gap={10} variant={BackgroundVariant.Dots} />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default Treege;
