import { Card, CardContent, Chip, Box, Button, Typography } from "@tracktor/design-system";
import { Position, Handle, useNodeConnections, type NodeProps, type Node } from "@xyflow/react";
import { memo } from "react";
import colors from "@/constants/colors";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

const TextNode = ({ id, data }: NodeProps<Node<CustomNodeData>>) => {
  const { name, onAddNode } = data;

  const parentConnections = useNodeConnections({ handleType: "target" });
  const childConnections = useNodeConnections({ handleType: "source" });

  const handleAddChild = () => {
    onAddNode?.(id);
  };

  const handleInsertBefore = () => {
    if (parentConnections.length > 0) {
      const parentId = parentConnections[0].source;
      onAddNode?.(parentId, id);
    }
  };

  return (
    <Box component="div">
      {parentConnections.length !== 0 && <Handle type="target" position={Position.Top} />}

      <Card sx={{ background: colors.background, borderRadius: "1rem" }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            height: 150,
            justifyContent: "space-between",
            width: 200,
          }}
        >
          <Typography variant="h5">{name}</Typography>
          <Chip color="primary" size="small" label="text" />
          <Box sx={{ display: "flex", gap: 1 }}>
            {childConnections.length === 0 && <Button onClick={handleAddChild}>Next node</Button>}
            {parentConnections.length > 0 && <Button onClick={handleInsertBefore}>Insert Before</Button>}
          </Box>
        </CardContent>
      </Card>

      <Handle type="source" position={Position.Bottom} />
    </Box>
  );
};

export default memo(TextNode);
