import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import { Card, CardContent, Chip, Box, Typography, IconButton, Stack } from "@tracktor/design-system";
import { Position, Handle, useNodeConnections, type NodeProps, type Node } from "@xyflow/react";
import { memo, useState } from "react";
import colors from "@/constants/colors";
import HandleSource from "@/features/Treege/TreegeFlow/Handlers/HandleSource";
import NodeConfigModal from "@/features/Treege/TreegeFlow/NodeConfigModal/NodeConfigModal";
import { CustomNodeData, NodeOptions } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

const TextNode = ({ id, data }: NodeProps<Node<CustomNodeData>>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // connections entrantes (pour afficher handle top)
  const parentConnections = useNodeConnections({ handleType: "target" });

  // 🔹 connections sortantes pour savoir si on a déjà un enfant
  const childConnections = useNodeConnections({ handleType: "source" });

  const { name, order, onAddNode } = data;

  const handleOpenModal = () => setIsModalOpen(true);

  const handleSaveModal = (config: NodeOptions) => {
    // 🔹 si on a déjà un enfant on insère entre parent et ce premier enfant
    const firstChildId = childConnections[0]?.target; // id du premier enfant
    onAddNode?.(id, firstChildId, config);
    setIsModalOpen(false);
  };

  const handleCancelModal = () => setIsModalOpen(false);

  return (
    <>
      <Box component="div">
        {parentConnections.length !== 0 && <Handle type="target" position={Position.Top} />}

        <Card
          sx={{
            background: colors.background,
            borderColor: colors.primary,
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
            <Stack spacing={2} alignItems="flex-end">
              <Typography variant="h5">
                {name} (#{order})
              </Typography>
              <Chip color="info" size="small" label="text" />

              <Stack sx={{ gap: 1 }}>
                <IconButton size="small" color="success" onClick={handleOpenModal}>
                  <AddBoxRoundedIcon
                    sx={{
                      color: "success",
                      fontSize: 20,
                    }}
                  />
                </IconButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <HandleSource handleId={`${id}-out`} position={Position.Bottom} rotation="0deg" />
      </Box>

      <NodeConfigModal isOpen={isModalOpen} onClose={handleCancelModal} onSave={handleSaveModal} />
    </>
  );
};

export default memo(TextNode);
