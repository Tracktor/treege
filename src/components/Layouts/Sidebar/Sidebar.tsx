import { Box } from "@mui/material";
import type { ReactNode } from "react";
import styles from "./Sidebar.module.scss";

interface SidebarProps {
  children?: ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => (
  <Box className={styles.Box} component="aside">
    {children}
  </Box>
);

export default Sidebar;
