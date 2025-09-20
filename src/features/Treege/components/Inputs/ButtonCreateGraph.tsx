import PolylineRoundedIcon from "@mui/icons-material/PolylineRounded";
import { Button, Box } from "@tracktor/design-system";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import NodeConfigModal from "@/features/Treege/TreegeFlow/Nodes/NodeConfigModal";
import { Attributes } from "@/features/Treege/TreegeFlow/utils/types";
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

  const handleSaveModal = (attributes: Attributes) => {
    addNode(undefined, attributes);
    setIsModalOpen(false);
  };

  return (
    <Box alignItems="center" justifyContent="center" display="flex" height="100%">
      <Button onClick={handleClick} size="medium" variant="contained" startIcon={<PolylineRoundedIcon />}>
        {t("createGraph")}
      </Button>

      {/* 🔹 Modale de création du premier node */}
      <NodeConfigModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveModal} />
    </Box>
  );
};

export default ButtonCreateGraph;
