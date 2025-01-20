import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EnergySavingsLeafRoundedIcon from "@mui/icons-material/EnergySavingsLeafRounded";
import ForestRoundedIcon from "@mui/icons-material/ForestRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import LoopRoundedIcon from "@mui/icons-material/LoopRounded";
import ParkRoundedIcon from "@mui/icons-material/ParkRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { Card, Chip, IconButton, Stack, Theme, Tooltip, Typography } from "@tracktor/design-system";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { useTranslation } from "react-i18next";
import { AppNode } from "@/components/DataDisplay/Nodes";
import { NODE_HEIGHT, NODE_WIDTH } from "@/constants/node";

interface DefaultNodeProps extends NodeProps<AppNode> {
  onDeleteChildren?: (data: NodeProps<AppNode>) => void;
  onAddChildren?: (data: NodeProps<AppNode>) => void;
  onEditChildren?: (data: NodeProps<AppNode>) => void;
  onOpenTreeModal?: (data: NodeProps<AppNode>) => void;
}

const styles = {
  card: {
    "&:hover": {
      boxShadow: `
            0 0 5px rgba(14, 211, 180, 0.5),
            0 0 10px rgba(14, 211, 180, 0.4),
            0 0 15px rgba(14, 211, 180, 0.3),
            0 0 20px rgba(14, 211, 180, 0.2),
            inset 0 0 5px rgba(14, 211, 180, 0.1)
          `,
    },
    border: "1px solid #0ed3b4",
    borderRadius: "3px",
    boxShadow: `
          0 0 5px rgba(14, 211, 180, 0.3),
          0 0 10px rgba(14, 211, 180, 0.2),
          0 0 15px rgba(14, 211, 180, 0.1),
          0 0 20px rgba(14, 211, 180, 0.05),
          inset 0 0 5px rgba(14, 211, 180, 0.05)
        `,
    height: NODE_HEIGHT,
    paddingX: 2,
    paddingY: 1,
    textAlign: "left",
    width: NODE_WIDTH,
  },
  icon: {
    color: ({ palette }: Theme) => palette.text.secondary,
    fontSize: 12,
  },
};

const DefaultNode = ({ onDeleteChildren, onAddChildren, onEditChildren, onOpenTreeModal, ...props }: DefaultNodeProps) => {
  const { t } = useTranslation(["translation", "form"]);
  const { isRoot, isLeaf, required, isDecision, type, label, repeatable, tag } = props?.data || {};
  const isField = !!type;
  const isTree = type === "tree";
  const isHidden = type === "hidden";
  const isValue = !isField;
  const isBranch = !isRoot && !isLeaf;

  return (
    <Card sx={styles.card}>
      <Stack justifyContent="space-between" height="100%">
        {/* Header */}
        <Stack>
          {/* Label and type */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography whiteSpace="nowrap" variant="body2" overflow="hidden" textOverflow="ellipsis">
              {label}
              {required && " *"}
            </Typography>
          </Stack>

          {/* Icon */}
          <Stack paddingTop={0.5} spacing={0.5} direction="row" fontSize={4}>
            {repeatable && (
              <Tooltip title={t("isARepeatable")} placement="bottom" arrow>
                <LoopRoundedIcon sx={styles.icon} />
              </Tooltip>
            )}
            {isLeaf && (
              <Tooltip title={t("isALeaf")} placement="bottom" arrow>
                <EnergySavingsLeafRoundedIcon sx={styles.icon} />
              </Tooltip>
            )}
            {isHidden && (
              <Tooltip title={t("isAHidden")} placement="bottom" arrow>
                <VisibilityOffRoundedIcon sx={styles.icon} />
              </Tooltip>
            )}
            {isRoot && (
              <Tooltip title={t("isTheRoot")} placement="bottom" arrow>
                <ParkRoundedIcon sx={styles.icon} />
              </Tooltip>
            )}
            {isBranch && (
              <Tooltip title={t("isABranch")} placement="bottom" arrow>
                <AccountTreeRoundedIcon sx={styles.icon} />
              </Tooltip>
            )}
            {isTree && (
              <Tooltip title={t("isATree")} placement="bottom" arrow>
                <ForestRoundedIcon sx={styles.icon} />
              </Tooltip>
            )}
          </Stack>

          {/* Type and tag */}
          <Stack direction="row" spacing={0.5} marginTop={1}>
            {isField && <Chip variant="rounded" color="info" size="xSmall" label={t(`type.${type}` as const as any, { ns: "form" })} />}
            {tag && (
              <Chip
                variant="outlined-rounded"
                color="warning"
                size="xSmall"
                label={tag}
                icon={
                  <LocalOfferRoundedIcon
                    sx={{
                      fontSize: 10,
                    }}
                  />
                }
              />
            )}
          </Stack>
        </Stack>

        {/* Actions */}
        <Stack direction="row" justifyContent="flex-end" spacing={0} alignSelf="flex-end">
          {!isRoot && (
            <Tooltip title={t("remove")} arrow>
              <IconButton size="small" color="error" onClick={() => onDeleteChildren?.(props)}>
                <DeleteOutlineRoundedIcon />
              </IconButton>
            </Tooltip>
          )}
          {!isValue && (
            <Tooltip title={t("edit")} arrow>
              <IconButton color="secondary" size="small" onClick={() => onEditChildren?.(props)}>
                <EditRoundedIcon />
              </IconButton>
            </Tooltip>
          )}
          {!isDecision && (
            <Tooltip title={t("add")} arrow>
              <IconButton color="success" size="small" onClick={() => onAddChildren?.(props)}>
                <AddBoxRoundedIcon />
              </IconButton>
            </Tooltip>
          )}
          {isTree && (
            <Tooltip title={t("show")} arrow>
              <IconButton color="info" size="small" onClick={() => onOpenTreeModal?.(props)}>
                <VisibilityRoundedIcon />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>

      {/* Handles dragging the node */}
      {props?.type !== "input" && <Handle type="target" position={Position.Top} />}
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
};

export default DefaultNode;
