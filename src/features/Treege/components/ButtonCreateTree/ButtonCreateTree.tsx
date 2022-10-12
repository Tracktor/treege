import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import { Box, Button } from "design-system-tracktor";
import { useTranslation } from "react-i18next";
import useButtonCreateTree from "@/features/Treege/components/ButtonCreateTree/useButtonCreateTree";

const ButtonCreateTree = () => {
  const { t } = useTranslation("button");
  const { handleClick } = useButtonCreateTree();

  return (
    <Box alignItems="center" justifyContent="center" display="flex" height="100%">
      <Button onClick={handleClick} size="medium" variant="contained" startIcon={<AccountTreeRoundedIcon />}>
        {t("createTree")}
      </Button>
    </Box>
  );
};

export default ButtonCreateTree;
