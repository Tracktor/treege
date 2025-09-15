import { Card, CardContent, Chip, Box, Button } from "@tracktor/design-system";
import { Position, Handle, useNodeConnections, type NodeProps, type Node } from "@xyflow/react";
import { memo } from "react";
import colors from "@/constants/colors";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/TreegeFlow";

const TextNode = ({ id, data }: NodeProps<Node<CustomNodeData>>) => {
  const connections = useNodeConnections({
    handleType: "target",
  });

  const handleAddNode = () => {
    data.onAddNode?.(id);
    console.log("Add node clicked for node id:", id);
  };

  return (
    <Box component="div">
      <Handle type="target" position={Position.Top} isConnectable={connections.length === 0} />

      <Card
        sx={{
          background: colors.background,
          borderRadius: "1rem",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            height: 150,
            justifyContent: "space-between",
            width: 200,
          }}
        >
          <Chip color="primary" size="small" label="text" />
          <Button onClick={handleAddNode}>+</Button>
        </CardContent>
      </Card>
      <Handle type="source" position={Position.Bottom} />
    </Box>
  );
};

export default memo(TextNode);
