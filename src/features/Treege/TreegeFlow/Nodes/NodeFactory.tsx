import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditIcon from "@mui/icons-material/Edit";
import { Card, CardContent, Chip, Box, Typography, IconButton, Stack } from "@tracktor/design-system";
import { NodeProps, Node, Position, useNodeConnections } from "@xyflow/react";
import { memo, ReactNode, useContext, useState } from "react";
import colors from "@/constants/colors";
import { TreegeFlowContext } from "@/features/Treege/context/TreegeFlowProvider";
import HandleSource from "@/features/Treege/TreegeFlow/Handlers/HandleSource";
import HandleTarget from "@/features/Treege/TreegeFlow/Handlers/HandleTarget";
import { isNodeType, nodeConfig } from "@/features/Treege/TreegeFlow/Nodes/nodeConfig";
import NodeMutationDialog from "@/features/Treege/TreegeFlow/Nodes/NodeMutationDialog";
import { CustomNodeData, Attributes, MinimalNode } from "@/features/Treege/TreegeFlow/utils/types";

interface NodeParams {
  id: string;
  data: CustomNodeData;
  chipLabel: string;
  showAddButton?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  children?: ReactNode;
  borderColor?: string;
}

const NodeRenderer = ({
  id,
  data,
  chipLabel,
  showAddButton = true,
  showEditButton = true,
  showDeleteButton = true,
  children,
  borderColor = colors.primary,
}: NodeParams) => {
  const { updateNode, addNode, deleteNode } = useContext(TreegeFlowContext);
  const childConnections = useNodeConnections({ handleType: "source" });
  const { name } = data;
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

  const handleSaveModal = (attributes: Attributes & { children?: MinimalNode[] }) => {
    if (isEditMode) {
      updateNode(id, attributes, attributes.children);
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
        <HandleTarget handleId={`${id}-in`} position={Position.Top} />

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
              <Typography variant="h5">{name}</Typography>
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

      <NodeMutationDialog key={id} isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveModal} initialValues={initialValues} />
    </>
  );
};

const NodeFactory = ({ id, data }: NodeProps<Node<CustomNodeData>>) => {
  const config = isNodeType(data.type) ? nodeConfig[data.type] : nodeConfig.default;

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
