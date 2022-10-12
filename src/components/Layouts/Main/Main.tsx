import { Box } from "design-system-tracktor";
import type { ReactNode } from "react";
import colors from "@/styles/colors.module.scss";

interface MainProps {
  children?: ReactNode;
}

const styles = {
  box: {
    border: `solid 1px ${colors.borderLight}`,
    flexGrow: 1,
  },
};

const Main = ({ children }: MainProps) => (
  <Box sx={styles.box} component="main" role="tree">
    {children}
  </Box>
);

export default Main;
