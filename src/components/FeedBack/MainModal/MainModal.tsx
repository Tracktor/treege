import { Box, Dialog } from "@tracktor/design-system";
import type { ReactNode } from "react";
import colors from "@/constants/colors";

interface TreeModalProps {
  children?: ReactNode;
  description?: string;
  title?: string;
  open: boolean;
  onClose?(): void;
}

const styles = {
  box: {
    backgroundColor: colors.background,
    border: `solid 1px ${colors.borderBlue}`,
  },
};

const MainModal = ({ children, description, open, onClose, title }: TreeModalProps) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    scroll="body"
    maxWidth="sm"
    fullWidth
  >
    <Box sx={styles.box} p={4}>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </Box>
  </Dialog>
);

export default MainModal;
