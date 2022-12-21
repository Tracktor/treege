import { Box } from "design-system-tracktor";
import type { ReactNode } from "react";
import colors from "@/constants/colors";

interface MainProps {
  children?: ReactNode;
}

const styles = {
  box: {
    border: `solid 1px ${colors.borderBlue}`,
    flexGrow: 1,
  },
};

const Main = ({ children }: MainProps) => (
  <Box sx={styles.box} component="main" role="tree">
    {children}
  </Box>
);

export default Main;
