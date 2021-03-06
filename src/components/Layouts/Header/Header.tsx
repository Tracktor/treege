import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import styles from "./Header.module.scss";

interface HeaderProps {
  children?: ReactNode;
}

const Header = ({ children }: HeaderProps) => (
  <Box className={styles.Box} padding={2} component="header">
    {children}
  </Box>
);

export default Header;
