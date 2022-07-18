import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import { Box, Button } from "@mui/material";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";

const ButtonCreateTree = () => {
  const { t } = useTranslation("button");
  const { setModalOpen } = useContext(DecisionTreeGeneratorContext);

  const handleClick = () => setModalOpen("add");

  return (
    <Box alignItems="center" justifyContent="center" display="flex" height="100%">
      <Button onClick={handleClick} size="medium" variant="contained" startIcon={<AccountTreeRoundedIcon />}>
        {t("createTree")}
      </Button>
    </Box>
  );
};

export default ButtonCreateTree;
