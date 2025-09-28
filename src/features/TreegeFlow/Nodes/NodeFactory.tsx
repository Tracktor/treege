import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Card, CardContent, Chip, IconButton, Stack, Typography } from "@tracktor/design-system";
import type { TreeNode } from "@tracktor/types-treege";
import { Node, NodeProps, useNodeConnections } from "@xyflow/react";
import { memo, ReactNode, useContext, useState } from "react";
import colors from "@/constants/colors";
import { TreegeFlowContext } from "@/context/TreegeFlow/TreegeFlowContext";
import HandleSource from "@/features/TreegeFlow/Handlers/HandleSource";
import HandleTarget from "@/features/TreegeFlow/Handlers/HandleTarget";
import { nodeConfig } from "@/features/TreegeFlow/Nodes/nodeConfig";
import NodeMutationDialog from "@/features/TreegeFlow/Nodes/NodeMutationDialog/NodeMutationDialog";
import { TreeNodeData } from "@/features/TreegeFlow/utils/types";

export const NODE_CARD_WIDTH = 200;
export const NODE_CARD_HEIGHT = 150;

interface NodeParams {
  id: string;
  data: TreeNodeData;
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
  const { attributes } = data;
  const nodeName = "type" in attributes ? attributes.name : attributes.name ?? "Node";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const isEditMode = modalMode === "edit";

  const initialValues = isEditMode
    ? {
        ...attributes,
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

  const handleSaveModal = (newAttributes: TreeNode["attributes"] & { children?: TreeNode[] }) => {
    if (isEditMode) {
      updateNode(id, newAttributes, newAttributes.children);
      setIsModalOpen(false);
      return;
    }

    const firstChildId = childConnections[0]?.target;
    addNode(id, {
      ...(newAttributes as TreeNode["attributes"]),
      childId: firstChildId,
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <Box component="div">
        <HandleTarget handleId={`${id}-in`} />

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
              height: NODE_CARD_HEIGHT,
              justifyContent: "space-between",
              width: NODE_CARD_WIDTH,
            }}
          >
            <Stack spacing={2} alignItems="flex-end">
              <Typography variant="h5">{nodeName}</Typography>
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

        <HandleSource handleId={`${id}-out`} />

        {children}
      </Box>

      <NodeMutationDialog key={id} isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveModal} initialValues={initialValues} />
    </>
  );
};

const NodeFactory = ({ id, data }: NodeProps<Node<TreeNodeData>>) => {
  const config = nodeConfig[data.attributes?.type ?? "option"];

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
