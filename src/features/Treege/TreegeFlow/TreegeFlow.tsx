import { ReactFlow, Controls } from "@xyflow/react";
import AnimatedDashedEdge from "@/features/Treege/TreegeFlow/Edges/AnimatedDashedEdge";
import TextNode from "@/features/Treege/TreegeFlow/Nodes/Text";
import useTreegeFlow from "@/features/Treege/TreegeFlow/useTreegeFlow";

export type CustomNodeData = {
  name: string;
  onAddNode?: (parentId: string, childId?: string) => void;
  onDeleteNode?: (parentId: string, childId?: string) => void;
};

const nodeTypes = {
  text: TextNode,
};

const edgeTypes = {
  animatedDashed: AnimatedDashedEdge,
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
      defaultEdgeOptions={{
        style: { stroke: "#999", strokeDasharray: "1 3", strokeLinecap: "round", strokeWidth: 1 },
        type: "smoothstep",
      }}
    >
      <Controls />
    </ReactFlow>
  );
};

export default TreegeFlow;
