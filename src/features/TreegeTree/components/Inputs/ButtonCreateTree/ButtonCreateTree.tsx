import { Box, Button } from "@tracktor/design-system";
import { useTranslation } from "react-i18next";
import TreePlusIcon from "@/components/DataDisplay/Icons/TreePlusIcon";
import useButtonCreateTree from "@/features/TreegeTree/components/Inputs/ButtonCreateTree/useButtonCreateTree";

const ButtonCreateTree = () => {
  const { t } = useTranslation("button");
  const { handleClick } = useButtonCreateTree();

  return (
    <Box alignItems="center" justifyContent="center" display="flex" height="100%">
      <Button onClick={handleClick} size="medium" variant="contained" startIcon={<TreePlusIcon />}>
        {t("createTree")}
      </Button>
    </Box>
  );
};

export default ButtonCreateTree;
