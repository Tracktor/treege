import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import { Box, Button } from "@mui/material";
import { useContext } from "react";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";

const ButtonCreateTree = () => {
  const { setModalOpen } = useContext(DecisionTreeGeneratorContext);

  const handleClick = () => setModalOpen("add");

  return (
    <Box alignItems="center" justifyContent="center" display="flex" height="100%">
      <Button onClick={handleClick} size="large">
        <AddBoxRoundedIcon />
      </Button>
    </Box>
  );
};

export default ButtonCreateTree;
