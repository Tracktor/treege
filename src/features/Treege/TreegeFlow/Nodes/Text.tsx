import AddIcon from "@mui/icons-material/Add";
import { Card, CardContent, Chip, Box, Typography, IconButton } from "@tracktor/design-system";
import { Position, Handle, useNodeConnections, type NodeProps, type Node } from "@xyflow/react";
import { memo } from "react";
import colors from "@/constants/colors";
import { CustomNodeData } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

const TextNode = ({ id, data }: NodeProps<Node<CustomNodeData>>) => {
  const { name, onAddNode } = data;

  // incoming edges (parent connections)
  const parentConnections = useNodeConnections({ handleType: "target" });
  // outgoing edges (child connections)
  const childConnections = useNodeConnections({ handleType: "source" });

  const isLastNode = childConnections.length === 0;

  // add a child below the current node
  const handleAddChild = () => {
    onAddNode?.(id);
  };

  // insert a node after the current node but before its first child
  const handleInsertChild = () => {
    if (childConnections.length > 0) {
      const childId = childConnections[0].target;
      // current node becomes the parent of the new node
      onAddNode?.(id, childId);
    } else {
      // no child: behave like add child
      onAddNode?.(id);
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
