import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import { Card, CardContent, Chip, Box, Typography, IconButton, Stack } from "@tracktor/design-system";
import { Position, Handle, useNodeConnections, type NodeProps, type Node } from "@xyflow/react";
import { memo, useState } from "react";
import colors from "@/constants/colors";
import NodeConfigModal from "@/features/Treege/TreegeFlow/NodeConfigModal/NodeConfigModal";
import { CustomNodeData, NodeOptions } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

const TextNode = ({ id, data }: NodeProps<Node<CustomNodeData>>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const parentConnections = useNodeConnections({ handleType: "target" });
  const { name, order, onAddNode } = data;

  const handleOpenModal = () => setIsModalOpen(true);

  const handleSaveModal = (config: NodeOptions) => {
    onAddNode?.(id, undefined, config);
    setIsModalOpen(false);
  };

  const handleCancelModal = () => setIsModalOpen(false);

  return (
    <>
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

        <Box sx={{ position: "relative" }}>
          <Handle type="source" position={Position.Bottom} id={`${id}-out`} style={{ height: 24, opacity: 0, width: 24 }} />
          <ArrowDropDownCircleIcon
            sx={{
              "&:hover": {
                backgroundColor: colors.secondary,
              },
              backgroundColor: colors.primary,
              borderRadius: "50%",
              bottom: -12,
              color: colors.background,
              cursor: "pointer",
              fontSize: 24,
              left: "calc(50% - 12px)",
              position: "absolute",
            }}
          />
        </Box>
      </Box>

      <NodeConfigModal isOpen={isModalOpen} onClose={handleCancelModal} onSave={handleSaveModal} />
    </>
  );
};

export default memo(TextNode);
