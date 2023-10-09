import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { AppBar, Box, Dialog, IconButton, Slide, Stack, Toolbar, TransitionProps, Typography } from "@tracktor/design-system";
import { forwardRef, ReactElement, ReactNode, Ref } from "react";
import colors from "@/constants/colors";

interface TreeModalProps {
  children?: ReactNode;
  title?: string;
  open: boolean;
  onClose?(): void;
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    margin: 1,
  },
  main: {
    border: `solid 1px ${colors.borderBlue}`,
    height: " 100%",
    margin: 1,
  },
  toolbar: {
    backgroundColor: colors.background,
    boxShadow: "none",
    display: "flex",
    padding: "0 ! important",
  },
  toolbarBox: {
    backgroundColor: colors.tertiary,
    border: `solid 1px ${colors.primary}`,
    margin: 1,
    paddingX: 2,
    paddingY: 1,
    width: "100%",
  },
};

const TransitionRef = (
  { children, appear, in: inProps, onEnter, onExited, onFocus, role, tabIndex, timeout }: { children: ReactElement } & TransitionProps,
  ref: Ref<unknown>,
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

export const Transition = forwardRef(TransitionRef);

const TreeModal = ({ children, open, onClose, title }: TreeModalProps) => (
  <Dialog
    PaperProps={{ sx: { backgroundColor: colors.background, backgroundImage: "none" } }}
    open={open}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    fullScreen
    TransitionComponent={Transition}
  >
    <Box sx={styles.container}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={styles.toolbar}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={styles.toolbarBox}>
            <Typography variant="h5">
              <strong>{title}</strong>
            </Typography>
            <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box sx={styles.main}>{children}</Box>
    </Box>
  </Dialog>
);

export default TreeModal;
