import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { AppBar, Box, Dialog, IconButton, Slide, Toolbar, TransitionProps } from "design-system-tracktor";
import { forwardRef, ReactElement, ReactNode, Ref } from "react";
import styles from "./TreeModal.module.scss";

interface TreeModalProps {
  children?: ReactNode;
  title?: string;
  open: boolean;
  onClose?(): void;
}

const Transition = (
  { children, appear, in: inProps, onEnter, onExited, onFocus, role, tabIndex, timeout }: { children: ReactElement } & TransitionProps,
  ref: Ref<unknown>
) => (
  <Slide
    direction="up"
    ref={ref}
    appear={appear}
    in={inProps}
    onEnter={onEnter}
    onExited={onExited}
    onFocus={onFocus}
    role={role}
    tabIndex={tabIndex}
    timeout={timeout}
  >
    {children}
  </Slide>
);

export const TransitionRef = forwardRef(Transition);

const TreeModal = ({ children, open, onClose, title }: TreeModalProps) => (
  <Dialog
    PaperProps={{ sx: { backgroundColor: "#0b1929", backgroundImage: "none" } }}
    open={open}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    fullScreen
    TransitionComponent={TransitionRef}
  >
    <>
      <AppBar position="sticky">
        <Toolbar className={styles.Toolbar}>
          <Box sx={{ flex: 1, ml: 2 }}>
            <h2>{title}</h2>
          </Box>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <CloseRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box className={styles.MainContainer} m={2}>
        {children}
      </Box>
    </>
  </Dialog>
);

export default TreeModal;
