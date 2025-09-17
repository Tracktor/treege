import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import { Card, CardContent, Chip, Box, Typography, IconButton, Stack, Divider } from "@tracktor/design-system";
import { Position, Handle, useNodeConnections, type NodeProps, type Node } from "@xyflow/react";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import colors from "@/constants/colors";
import NodeConfigModal from "@/features/Treege/TreegeFlow/NodeConfigModal/NodeConfigModal";
import { CustomNodeData, NodeOptions } from "@/features/Treege/TreegeFlow/Nodes/nodeTypes";

const BooleanNode = ({ id, data }: NodeProps<Node<CustomNodeData>>) => {
  const { t } = useTranslation("form");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [branchHandle, setBranchHandle] = useState<string | null>(null);
  const parentConnections = useNodeConnections({ handleType: "target" });
  const { name, order, onAddNode, isDecision } = data;

  const handleOpenModal = () => {
    setBranchHandle(null);
    setIsModalOpen(true);
  };

  const handleOpenBranchModal = (branch: "Yes" | "No") => {
    const handleId = branch === "Yes" ? `${id}-true` : `${id}-false`;
    setBranchHandle(handleId);
    setIsModalOpen(true);
  };

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
            overflow: "visible",
            position: "relative",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              height: 130,
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

          {isDecision && (
            <Stack mr={2} ml={2}>
              <Divider sx={{ ml: -2, mr: -2 }} />

              <Stack spacing={2} direction="row" alignItems="center" alignSelf="end" sx={{ position: "relative" }}>
                <Typography>{t("true")}</Typography>
                <IconButton size="small" color="info" onClick={() => handleOpenBranchModal("Yes")}>
                  <AddBoxRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>

                <Handle
                  type="source"
                  position={Position.Right}
                  id={`${id}-true`}
                  style={{
                    fontSize: 20,
                    opacity: 0,
                    position: "absolute",
                    right: -27,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />

                <ArrowDropDownCircleIcon
                  sx={{
                    "&:hover": {
                      backgroundColor: colors.secondary,
                    },
                    backgroundColor: colors.primary,
                    borderRadius: "50%",
                    color: colors.background,
                    cursor: "pointer",
                    fontSize: 20,
                    position: "absolute",
                    right: -27,
                    top: "50%",
                    transform: "translateY(-50%) rotate(-90deg)",
                  }}
                />
              </Stack>

              <Divider sx={{ ml: -2, mr: -2 }} />

              <Stack spacing={2} direction="row" alignItems="center" alignSelf="end" sx={{ position: "relative" }}>
                <Typography>{t("false")}</Typography>
                <IconButton size="small" color="secondary" onClick={() => handleOpenBranchModal("No")}>
                  <AddBoxRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>

                <Handle
                  type="source"
                  position={Position.Right}
                  id={`${id}-false`}
                  style={{
                    fontSize: 20,
                    opacity: 0,
                    position: "absolute",
                    right: -27,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />

                <ArrowDropDownCircleIcon
                  sx={{
                    "&:hover": {
                      backgroundColor: colors.secondary,
                    },
                    backgroundColor: colors.primary,
                    borderRadius: "50%",
                    color: colors.background,
                    cursor: "pointer",
                    fontSize: 20,
                    position: "absolute",
                    right: -27,
                    top: "50%",
                    transform: "translateY(-50%) rotate(-90deg)",
                  }}
                />
              </Stack>
            </Stack>
          )}
        </Card>

        {!isDecision && (
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
        )}
      </Box>

      <NodeConfigModal isOpen={isModalOpen} onClose={handleCancelModal} onSave={handleSaveModal} />
    </>
  );
};

export default memo(BooleanNode);
