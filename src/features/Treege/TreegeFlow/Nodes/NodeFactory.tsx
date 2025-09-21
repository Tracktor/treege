import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditIcon from "@mui/icons-material/Edit";
import { Card, CardContent, Chip, Box, Typography, IconButton, Stack } from "@tracktor/design-system";
import { NodeProps, Node, Handle, Position, useNodeConnections } from "@xyflow/react";
import { memo, ReactNode, useContext, useState } from "react";
import colors from "@/constants/colors";
import { TreegeFlowContext } from "@/features/Treege/context/TreegeFlowProvider";
import HandleSource from "@/features/Treege/TreegeFlow/Handlers/HandleSource";
import NodeConfigModal from "@/features/Treege/TreegeFlow/Nodes/NodeConfigModal";
import { CustomNodeData, Attributes } from "@/features/Treege/TreegeFlow/utils/types";

interface BaseNodeProps {
  id: string;
  data: CustomNodeData;
  chipLabel: string;
  showAddButton?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  children?: ReactNode;
  borderColor?: string;
}

interface NodeConfig {
  chipLabel: string;
  borderColor: string;
  showAddButton?: (data: CustomNodeData) => boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
}

const nodeConfig: Record<string, NodeConfig> = {
  boolean: {
    borderColor: colors.primary,
    chipLabel: "boolean",
    showAddButton: (data) => !data.isDecision,
    showDeleteButton: true,
    showEditButton: true,
  },
  option: {
    borderColor: colors.secondary,
    chipLabel: "option",
    showAddButton: () => true,
    showDeleteButton: false,
    showEditButton: false,
  },
  text: {
    borderColor: colors.primary,
    chipLabel: "text",
    showAddButton: () => true,
    showDeleteButton: true,
    showEditButton: true,
  },
};

const NodeRenderer = ({
  id,
  data,
  chipLabel,
  showAddButton = true,
  showEditButton = true,
  showDeleteButton = true,
  children,
  borderColor = colors.primary,
}: BaseNodeProps) => {
  const { updateNode, addNode, deleteNode } = useContext(TreegeFlowContext);
  const parentConnections = useNodeConnections({ handleType: "target" });
  const childConnections = useNodeConnections({ handleType: "source" });
  const { name, order } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const isEditMode = modalMode === "edit";
  const initialValues = isEditMode
    ? {
        ...data,
        children: data.children ?? [],
      }
    : undefined;

  const handleOpenEditModal = () => {
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleDeleteNode = () => {
    deleteNode(id);
  };

  const handleSaveModal = (attributes: Attributes) => {
    if (isEditMode) {
      updateNode(id, attributes);
      setIsModalOpen(false);
      return;
    }

    const firstChildId = childConnections[0]?.target;
    addNode(id, {
      ...(attributes as Attributes),
      childId: firstChildId,
    });
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

              <Stack direction="row">
                {showDeleteButton && (
                  <IconButton size="small" color="error" onClick={handleDeleteNode}>
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                )}

                {showEditButton && (
                  <IconButton size="small" color="secondary" onClick={handleOpenEditModal}>
                    <EditIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                )}

                {showAddButton && (
                  <IconButton size="small" color="success" onClick={handleOpenAddModal}>
                    <AddBoxRoundedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <HandleSource handleId={`${id}-out`} position={Position.Bottom} rotation="0deg" />

        {children}
      </Box>

      <NodeConfigModal key={id} isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveModal} initialValues={initialValues} />
    </>
  );
};

const NodeFactory = ({ id, data }: NodeProps<Node<CustomNodeData>>) => {
  const config = nodeConfig[data.type ?? "text"] ?? nodeConfig.text;

  return (
    <NodeRenderer
      id={id}
      data={data}
      chipLabel={config.chipLabel}
      borderColor={config.borderColor}
      showAddButton={config.showAddButton?.(data)}
      showEditButton={config.showEditButton}
      showDeleteButton={config.showDeleteButton}
    />
  );
};

export default memo(NodeFactory);
