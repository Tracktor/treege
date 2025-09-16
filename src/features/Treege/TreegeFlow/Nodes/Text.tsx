import AddIcon from "@mui/icons-material/Add";
import { Card, CardContent, Chip, Box, Typography, IconButton } from "@tracktor/design-system";
import { Position, Handle, useNodeConnections, type NodeProps, type Node } from "@xyflow/react";
import { memo } from "react";
import colors from "@/constants/colors";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

const TextNode = ({ id, data }: NodeProps<Node<CustomNodeData>>) => {
  const { name, order, onAddNode } = data;

  const parentConnections = useNodeConnections({ handleType: "target" });
  const childConnections = useNodeConnections({ handleType: "source" });

  const isLastNode = childConnections.length === 0;

  const handleAddChild = () => {
    onAddNode?.(id); // hook will auto pick child if needed
  };

  const handleInsertChild = () => {
    onAddNode?.(id); // hook auto picks the correct child
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
          <Typography variant="h5">
            {name} (#{order})
          </Typography>
          <Chip color="primary" size="small" label="text" />
          <Box sx={{ display: "flex", gap: 1 }}>
            {isLastNode && (
              <IconButton size="small" color="primary" onClick={handleAddChild}>
                <AddIcon />
                add
              </IconButton>
            )}

            {!isLastNode && (
              <IconButton size="small" color="secondary" onClick={handleInsertChild}>
                <AddIcon />
                insert
              </IconButton>
            )}
          </Box>
        </CardContent>
      </Card>

      <Handle type="source" position={Position.Bottom} />
    </Box>
  );
};

export default memo(TextNode);
