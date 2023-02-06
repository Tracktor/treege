import { Box } from "@tracktor/design-system";
import type { ReactNode } from "react";
import colors from "@/constants/colors";

interface HeaderProps {
  children?: ReactNode;
}

const styles = {
  box: {
    border: `solid 1px ${colors.borderBlue}`,
    flexGrow: 0,
  },
};

const Header = ({ children }: HeaderProps) => (
  <Box sx={styles.box} padding={2} component="header">
    {children}
  </Box>
);

export default Header;
