import { Dialog, DialogContent, Typography } from "@tracktor/design-system";
import type { ReactNode } from "react";
import colors from "@/constants/colors";

interface TreeModalProps {
  children?: ReactNode;
  description?: string;
  title?: string;
  open: boolean;
  onClose?(): void;
}

const MainModal = ({ children, description, open, onClose, title }: TreeModalProps) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    maxWidth="sm"
    fullWidth
    scroll="paper"
  >
    <DialogContent
      sx={{
        backgroundColor: colors.background,
        border: `solid 1px ${colors.borderBlue}`,
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <Typography variant="h3" pb={2}>
        {title}
      </Typography>
      <Typography pb={2}>{description}</Typography>
      {children}
    </DialogContent>
  </Dialog>
);

export default MainModal;
