import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import EditIcon from "@mui/icons-material/Edit";
import { Card, CardContent, Chip, Box, Typography, IconButton, Stack } from "@tracktor/design-system";
import { NodeProps, Node, Handle, Position, useNodeConnections } from "@xyflow/react";
import { memo, ReactNode, useState } from "react";
import colors from "@/constants/colors";
import HandleSource from "@/features/Treege/TreegeFlow/Handlers/HandleSource";
import nodeConfig from "@/features/Treege/TreegeFlow/Nodes/nodeConfig";
import NodeConfigModal from "@/features/Treege/TreegeFlow/Nodes/NodeConfigModal";
import { CustomNodeData, Attributes } from "@/features/Treege/TreegeFlow/utils/types";

interface BaseNodeProps {
  id: string;
  data: CustomNodeData;
  chipLabel: string;
  showAddButton?: boolean;
  children?: ReactNode;
  borderColor?: string;
}

const NodeRenderer = ({ id, data, chipLabel, showAddButton = true, children, borderColor = colors.primary }: BaseNodeProps) => {
  const parentConnections = useNodeConnections({ handleType: "target" });
  const childConnections = useNodeConnections({ handleType: "source" });
  const { name, order, onAddNode } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const handleOpenEditModal = () => {
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveModal = (attributes: Attributes) => {
    const firstChildId = childConnections[0]?.target;
    onAddNode?.(id, firstChildId, attributes);
    setIsModalOpen(false);
  };

  return (
    <>
      <Box component="div">
        {parentConnections.length !== 0 && <Handle type="target" position={Position.Top} />}

        <Card
          sx={{
            background: colors.background,
            borderColor,
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
              <Chip color="info" size="small" label={chipLabel} />

              {showAddButton && (
                <Stack direction="row">
                  <IconButton size="small" color="secondary" onClick={handleOpenEditModal}>
                    <EditIcon sx={{ fontSize: 20 }} />
                  </IconButton>

                  <IconButton size="small" color="success" onClick={handleOpenAddModal}>
                    <AddBoxRoundedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>

        <HandleSource handleId={`${id}-out`} position={Position.Bottom} rotation="0deg" />

        {children}
      </Box>

      <NodeConfigModal
        key={id}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        initialValues={
          modalMode === "edit"
            ? {
                ...data,
                children: data.children ?? [],
              }
            : undefined
        }
      />
    </>
  );
};

const NodeFactory = ({ id, data }: NodeProps<Node<CustomNodeData>>) => {
  const config = nodeConfig[data.type ?? ""] ?? {
    borderColor: colors.primary,
    chipLabel: data.type ?? "unknown",
    showAddButton: () => true,
  };

  return (
    <NodeRenderer
      id={id}
      data={data}
      chipLabel={config.chipLabel}
      borderColor={config.borderColor}
      showAddButton={config.showAddButton?.(data)}
    />
  );
};

export default memo(NodeFactory);
