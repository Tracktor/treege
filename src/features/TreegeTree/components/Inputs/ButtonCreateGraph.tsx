import PolylineRoundedIcon from "@mui/icons-material/PolylineRounded";
import { Button, Box } from "@tracktor/design-system";
import type { TreeNode } from "@tracktor/types-treege";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import NodeMutationDialog from "@/features/TreegeFlow/Nodes/NodeMutationDialog/NodeMutationDialog";
import useTreegeFlowContext from "@/hooks/useTreegeFlowContext";

const ButtonCreateGraph = () => {
  const { t } = useTranslation("button");
  const { addNode } = useTreegeFlowContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveModal = (config: TreeNode["attributes"] & { children?: TreeNode[] }) => {
    addNode(undefined, config);
    setIsModalOpen(false);
  };

  return (
    <Box alignItems="center" justifyContent="center" display="flex" height="100%">
      <Button onClick={handleClick} size="medium" variant="contained" startIcon={<PolylineRoundedIcon />}>
        {t("createGraph")}
      </Button>

      <NodeMutationDialog isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveModal} />
    </Box>
  );
};

export default ButtonCreateGraph;
