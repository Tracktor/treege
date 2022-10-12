import { Box } from "design-system-tracktor";
import type { ReactNode } from "react";
import colors from "@/constants/colors";

interface ActionProps {
  children?: ReactNode;
}

const styles = {
  box: {
    border: `solid 1px ${colors.borderLight}`,
    flexGrow: 0,
  },
};

const Action = ({ children }: ActionProps) => (
  <Box p={2} role="group" sx={styles.box}>
    {children}
  </Box>
);

export default Action;
