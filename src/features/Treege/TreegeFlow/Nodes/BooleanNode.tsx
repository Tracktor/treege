import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import { Card, CardContent, Chip, Box, Typography, IconButton, Stack } from "@tracktor/design-system";
import { Position, Handle, useNodeConnections, type NodeProps, type Node } from "@xyflow/react";
import { memo, useState } from "react";
import colors from "@/constants/colors";
import HandleSource from "@/features/Treege/TreegeFlow/Handlers/HandleSource";
import NodeConfigModal from "@/features/Treege/TreegeFlow/NodeConfigModal/NodeConfigModal";
import { CustomNodeData, NodeOptions } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

const BooleanNode = ({ id, data }: NodeProps<Node<CustomNodeData>>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [branchHandle, setBranchHandle] = useState<string | null>(null);
  const parentConnections = useNodeConnections({ handleType: "target" });
  const { name, order, onAddNode, isDecision } = data;

  const handleOpenModal = () => {
    setBranchHandle(null);
    setIsModalOpen(true);
  };

  // const trueConnections = useNodeConnections({
  //   handleId: `${id}-true`,
  //   handleType: "source",
  // });
  // const falseConnections = useNodeConnections({
  //   handleId: `${id}-false`,
  //   handleType: "source",
  // });

  // const isTrueConnected = trueConnections.length > 0;
  // const isFalseConnected = falseConnections.length > 0;

  // const handleOpenBranchModal = (branch: "Yes" | "No") => {
  //   const handleId = branch === "Yes" ? `${id}-true` : `${id}-false`;
  //   setBranchHandle(handleId);
  //   setIsModalOpen(true);
  // };

  const handleSaveModal = (config: NodeOptions) => {
    onAddNode?.(id, undefined, {
      ...config,
      sourceHandle: branchHandle ?? undefined,
    });
    setIsModalOpen(false);
    setBranchHandle(null);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setBranchHandle(null);
  };

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
              <Chip color="info" size="small" label="boolean" />

              {!isDecision && (
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
              )}
            </Stack>
          </CardContent>
        </Card>

        <HandleSource handleId={`${id}-out`} position={Position.Bottom} rotation="0deg" />
      </Box>

      <NodeConfigModal isOpen={isModalOpen} onClose={handleCancelModal} onSave={handleSaveModal} />
    </>
  );
};

export default memo(BooleanNode);
