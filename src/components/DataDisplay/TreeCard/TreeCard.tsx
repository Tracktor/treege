import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EnergySavingsLeafRoundedIcon from "@mui/icons-material/EnergySavingsLeafRounded";
import ForestRoundedIcon from "@mui/icons-material/ForestRounded";
import LoopRoundedIcon from "@mui/icons-material/LoopRounded";
import ParkRoundedIcon from "@mui/icons-material/ParkRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { Box, Button, Chip, GlobalStyles, Stack, Tooltip, Typography } from "@tracktor/design-system";
import { brown } from "@tracktor/design-system/colors";
import type { HierarchyPointNode } from "d3-hierarchy";
import { memo } from "react";
import type { CustomNodeElementProps, TreeNodeDatum } from "react-d3-tree/lib/types/types/common";
import { useTranslation } from "react-i18next";
import colors from "@/constants/colors";
import type { TreeNode } from "@/features/Treege/type/TreeNode";

interface TreeCardProps extends Omit<CustomNodeElementProps, "nodeDatum" | "hierarchyPointNode"> {
  nodeDatum: TreeNode | TreeNodeDatum;
  size?: number;
  onAddChildren?(hierarchyPointNode: HierarchyPointNode<TreeNode>): void;
  onEditChildren?(hierarchyPointNode: HierarchyPointNode<TreeNode>): void;
  onDeleteChildren?(hierarchyPointNode: HierarchyPointNode<TreeNode>): void;
  onOpenTreeModal?(hierarchyPointNode: HierarchyPointNode<TreeNode>): void;
  hierarchyPointNode: HierarchyPointNode<TreeNode>;
}

const styles = {
  actionButton: {
    minWidth: "auto !important",
  },
  container: {
    background: colors.background,
    borderRadius: "1rem",
  },
  containerField: {
    background: colors.background,
    border: `solid 1px ${colors.primary}`,
    borderRadius: "1rem",
  },
  containerHidden: {
    background: colors.background,
    border: `solid 1px ${colors.borderGrey}`,
    borderRadius: "1rem",
  },
  containerTitle: {
    background: brown[700],
    border: `solid 1px ${brown[400]}`,
    borderRadius: "1rem",
  },
  containerTree: {
    background: colors.tertiary,
    border: `solid 1px ${colors.primary}`,
    borderRadius: "1rem",
  },
  containerValue: {
    background: colors.background,
    border: `solid 1px ${colors.secondary}`,
    borderRadius: "1rem",
  },
  icon: {
    color: colors.grey500,
  },
  nodeSvg: {
    stroke: "transparent !important",
  },
  stepChip: {
    fontSize: ".7rem !important",
    fontWeight: "bold",
    height: "20px !important",
  },
  title: {
    display: "-webkit-box",
    margin: 0,
    overflow: "hidden",
    textAlign: "right",
    textOverflow: "ellipsis",
    webkitBoxOrient: "vertical",
    webkitLineClamp: 2,
  },
};

const getCardStyle = (type?: string | number | boolean) => {
  const isField = !!type;
  const isTree = type === "tree";
  const isHidden = type === "hidden";
  const isTitle = type === "title";

  if (isTitle) {
    return styles.containerTitle;
  }

  if (isHidden) {
    return styles.containerHidden;
  }
  if (isTree) {
    return styles.containerTree;
  }

  if (isField) {
    return styles.containerField;
  }

  return styles.containerValue;
};

const TreeCard = ({
  nodeDatum,
  onAddChildren,
  onEditChildren,
  onDeleteChildren,
  onOpenTreeModal,
  hierarchyPointNode,
  size = 220,
}: TreeCardProps) => {
  const { t } = useTranslation(["translation", "form"]);
  const { attributes } = nodeDatum || {};
  const { isRoot, isLeaf, required, isDecision, step, type, label, repeatable, tag } = attributes || {};
  const isField = !!type;
  const isTree = type === "tree";
  const isHidden = type === "hidden";
  const isValue = !isField;
  const isBranch = !isRoot && !isLeaf;

  return (
    <g>
      <GlobalStyles styles={{ ".rd3t-node svg": styles.nodeSvg }} />
      <Box component="foreignObject" height={size} width={size} x={`-${size / 2}`} y={`-${size / 2}`} sx={getCardStyle(type)}>
        <Box flex={1} display="flex" p={2} height="100%" flexDirection="column" justifyContent="space-between">
          <Stack alignItems="flex-end" spacing={0.5}>
            {isField && (
              <Stack direction="row" spacing={1} alignItems="center">
                {step && (
                  <Tooltip title={`${t("step", { ns: "form" })} ${nodeDatum?.attributes?.step}`} placement="left" arrow>
                    <Chip color="primary" size="small" label={step} sx={styles.stepChip} />
                  </Tooltip>
                )}
                <Typography variant="subtitle2" sx={styles.title}>
                  <strong>{label}</strong>
                </Typography>
              </Stack>
            )}
            {isField && <Chip color="info" size="small" label={t(`type.${type}` as const as any, { ns: "form" })} />}
            {tag && <Chip variant="outlined" color="warning" size="small" label={tag} />}

            {required && (
              <Stack direction="row" spacing={0.5}>
                {required && (
                  <Typography variant="body2" sx={{ color: ({ palette }) => palette.error.main }}>
                    {t("required")}
                  </Typography>
                )}
              </Stack>
            )}
            <Stack spacing={0.5} alignItems="flex-end">
              {isValue && (
                <Typography variant="subtitle2" sx={styles.title}>
                  <strong>{label}</strong>
                </Typography>
              )}
            </Stack>
            <Stack paddingTop={0.5} spacing={0.5} direction="row">
              {repeatable && (
                <Tooltip title={t("isARepeatable")} placement="bottom" arrow>
                  <LoopRoundedIcon style={styles.icon} />
                </Tooltip>
              )}
              {isLeaf && (
                <Tooltip title={t("isALeaf")} placement="bottom" arrow>
                  <EnergySavingsLeafRoundedIcon style={styles.icon} />
                </Tooltip>
              )}
              {isHidden && (
                <Tooltip title={t("isAHidden")} placement="bottom" arrow>
                  <VisibilityOffRoundedIcon style={styles.icon} />
                </Tooltip>
              )}
              {isRoot && (
                <Tooltip title={t("isTheRoot")} placement="bottom" arrow>
                  <ParkRoundedIcon style={styles.icon} />
                </Tooltip>
              )}
              {isBranch && (
                <Tooltip title={t("isABranch")} placement="bottom" arrow>
                  <AccountTreeRoundedIcon style={styles.icon} />
                </Tooltip>
              )}
              {isTree && (
                <Tooltip title={t("isATree")} placement="bottom" arrow>
                  <ForestRoundedIcon style={styles.icon} />
                </Tooltip>
              )}
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="flex-end" spacing={0} alignSelf="flex-end">
            {!isRoot && (
              <Tooltip title={t("remove")} arrow>
                <Button
                  variant="text"
                  sx={styles.actionButton}
                  size="small"
                  color="error"
                  onClick={() => onDeleteChildren?.(hierarchyPointNode)}
                >
                  <DeleteOutlineRoundedIcon />
                </Button>
              </Tooltip>
            )}
            {!isValue && (
              <Tooltip title={t("edit")} arrow>
                <Button
                  variant="text"
                  color="secondary"
                  sx={styles.actionButton}
                  size="small"
                  onClick={() => onEditChildren?.(hierarchyPointNode)}
                >
                  <EditRoundedIcon />
                </Button>
              </Tooltip>
            )}
            {!isDecision && (
              <Tooltip title={t("add")} arrow>
                <Button
                  variant="text"
                  color="success"
                  sx={styles.actionButton}
                  size="small"
                  onClick={() => onAddChildren?.(hierarchyPointNode)}
                >
                  <AddBoxRoundedIcon />
                </Button>
              </Tooltip>
            )}
            {isTree && (
              <Tooltip title={t("show")} arrow>
                <Button
                  variant="text"
                  color="info"
                  sx={styles.actionButton}
                  size="small"
                  onClick={() => onOpenTreeModal?.(hierarchyPointNode)}
                >
                  <VisibilityRoundedIcon />
                </Button>
              </Tooltip>
            )}
          </Stack>
        </Box>
      </Box>
    </g>
  );
};
export default memo(TreeCard);
