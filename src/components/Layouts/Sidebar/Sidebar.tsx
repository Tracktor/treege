import { Box } from "design-system-tracktor";
import type { ReactNode } from "react";
import colors from "@/constants/colors";

interface SidebarProps {
  children?: ReactNode;
}

const styles = {
  box: {
    border: `solid 1px ${colors.borderBlue}`,
    flexGrow: 1,
    overflow: "auto",
  },
};

const Sidebar = ({ children }: SidebarProps) => (
  <Box sx={styles.box} component="aside">
    {children}
  </Box>
);

export default Sidebar;
