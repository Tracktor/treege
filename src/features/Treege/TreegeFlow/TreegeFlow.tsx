import { ReactFlow, Controls, DefaultEdgeOptions } from "@xyflow/react";
import edgeTypes from "@/features/Treege/TreegeFlow/Edges/edgesTypes";
import nodeTypes from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";
import useTreegeFlow from "@/features/Treege/TreegeFlow/useTreegeFlow";

const edgeOptions: DefaultEdgeOptions = {
  style: { stroke: "#999", strokeDasharray: "1 3", strokeLinecap: "round", strokeWidth: 1 },
  type: "smoothstep",
};

const TreegeFlow = () => {
  const { nodes, onNodesChange, onEdgesChange, edges } = useTreegeFlow();

  return (
    <ReactFlow
      fitView
      nodeTypes={nodeTypes}
      nodes={nodes}
      edgeTypes={edgeTypes}
      edges={edges.map((e) => ({ ...e, type: "animatedDashed" }))}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      defaultEdgeOptions={edgeOptions}
    >
      <Controls />
    </ReactFlow>
  );
};

export default TreegeFlow;
