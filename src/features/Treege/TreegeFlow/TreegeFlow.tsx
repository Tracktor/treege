import { Button } from "@tracktor/design-system";
import { Dispatch, SetStateAction } from "react";
import ReactFlow, { Background, Controls, Edge, Node, OnEdgesChange, OnNodesChange, useReactFlow } from "reactflow";
import autoLayout from "@/features/Treege/autoLayout/autoLayout";
import { CustomNodeData } from "@/features/Treege/Treege";

interface TreegeFlowProps {
  nodes: Node<CustomNodeData>[];
  setNodes: Dispatch<SetStateAction<Node<CustomNodeData>[]>>;
  onNodesChange: OnNodesChange;
  edges: Edge[];
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  onEdgesChange: OnEdgesChange;
}

const TreegeFlow = ({ nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange }: TreegeFlowProps) => {
  const { fitView } = useReactFlow();

  const addNode = async () => {
    const lastNode = nodes[nodes.length - 1];
    const newId = (nodes.length + 1).toString();

    const newNode: Node<CustomNodeData> = {
      data: { label: `Node ${newId}` },
      id: newId,
      position: { x: 0, y: 0 },
    };

    const newEdge: Edge = {
      id: `e${lastNode.id}-${newId}`,
      source: lastNode.id,
      target: newId,
    };

    const newNodes = [...nodes, newNode];
    const newEdges = [...edges, newEdge];

    const layoutNodes = await autoLayout(newNodes, newEdges);

    setNodes(layoutNodes);
    setEdges(newEdges);

    setTimeout(() => fitView({ duration: 500, padding: 0.2 }), 0);
  };

  return (
    <>
      <Button onClick={addNode} style={{ marginBottom: 10 }}>
        Ajouter un node
      </Button>
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView>
        <Controls />
        <Background />
      </ReactFlow>
    </>
  );
};

export default TreegeFlow;
