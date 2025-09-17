import AddIcon from "@mui/icons-material/Add";
import { Card, CardContent, Chip, Box, Typography, IconButton, Stack } from "@tracktor/design-system";
import { Position, Handle, useNodeConnections, type NodeProps, type Node } from "@xyflow/react";
import { memo } from "react";
import colors from "@/constants/colors";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

const TextNode = ({ id, data }: NodeProps<Node<CustomNodeData>>) => {
  const parentConnections = useNodeConnections({ handleType: "target" });
  const { name, order, onAddNode } = data;

  const handleAddChild = () => {
    onAddNode?.(id);
  };

  return (
    <Box component="div">
      {parentConnections.length !== 0 && <Handle type="target" position={Position.Top} />}

      <Card sx={{ background: colors.background, borderColor: colors.primary, borderRadius: "1rem" }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            height: 150,
            justifyContent: "space-between",
            width: 200,
          }}
        >
          <Stack spacing={2} alignItems="flex-end">
            <Typography variant="h5">
              {name} (#{order})
            </Typography>
            <Chip color="info" size="small" label="text" />
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton size="small" color="primary" onClick={handleAddChild}>
                <AddIcon />
              </IconButton>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Handle type="source" position={Position.Bottom} />
    </Box>
  );
};

export default memo(TextNode);
