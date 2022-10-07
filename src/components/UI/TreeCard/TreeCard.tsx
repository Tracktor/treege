import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EnergySavingsLeafRoundedIcon from "@mui/icons-material/EnergySavingsLeafRounded";
import ForestRoundedIcon from "@mui/icons-material/ForestRounded";
import ParkRoundedIcon from "@mui/icons-material/ParkRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import type { HierarchyPointNode } from "d3-hierarchy";
import { Box, Button, Chip, Stack, Tooltip, Typography } from "design-system-tracktor";
import { memo } from "react";
import type { CustomNodeElementProps, TreeNodeDatum } from "react-d3-tree/lib/types/common";
import { useTranslation } from "react-i18next";
import styles from "./TreeCard.module.scss";
import type { TreeNode } from "@/features/DecisionTreeGenerator/type/TreeNode";

interface TreeCardProps extends Omit<CustomNodeElementProps, "nodeDatum" | "hierarchyPointNode"> {
  nodeDatum: TreeNode | TreeNodeDatum;
  size?: number;
  onAddChildren?(hierarchyPointNode: HierarchyPointNode<TreeNode>): void;
  onEditChildren?(hierarchyPointNode: HierarchyPointNode<TreeNode>): void;
  onDeleteChildren?(hierarchyPointNode: HierarchyPointNode<TreeNode>): void;
  onOpenTreeModal?(hierarchyPointNode: HierarchyPointNode<TreeNode>): void;
  hierarchyPointNode: HierarchyPointNode<TreeNode>;
}

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
  const { isRoot, isLeaf, required, step, type, label } = attributes || {};
  const isField = !!type;
  const isTree = type === "tree";
  const isValue = !isField;
  const isBranch = !isRoot && !isLeaf;

  return (
    <g>
      <foreignObject
        height={size}
        width={size}
        x={`-${size / 2}`}
        y={`-${size / 2}`}
        className={isTree ? styles.ContainerTree : isField ? styles.ContainerField : styles.ContainerValue}
      >
        <Box flex={1} display="flex" p={2} height="100%" flexDirection="column" justifyContent="space-between">
          <Stack alignItems="flex-end" spacing={0.5}>
            {isField && (
              <Stack direction="row" spacing={1} alignItems="center">
                {step && (
                  <Tooltip title={`${t("step", { ns: "form" })} ${nodeDatum?.attributes?.step}`} placement="left" arrow>
                    <Chip color="primary" size="small" label={step} className={styles.StepChip} />
                  </Tooltip>
                )}
                <Typography variant="subtitle2" className={styles.Title}>
                  <strong>{label}</strong>
                </Typography>
              </Stack>
            )}
            {isField && <Chip color="info" size="small" label={t(`type.${type}`, { ns: "form" })} />}
            {required && (
              <Stack direction="row" spacing={0.5}>
                {required && <Chip color="warning" size="small" variant="outlined" label={`${t("required")}`} />}
              </Stack>
            )}
            <Stack spacing={0.5} alignItems="flex-end">
              {isValue && (
                <Typography variant="subtitle2" className={styles.Title}>
                  <strong>{label}</strong>
                </Typography>
              )}
            </Stack>
            <Box paddingTop={0.5}>
              {isLeaf && (
                <Tooltip title={t("isALeaf")} placement="bottom" arrow>
                  <EnergySavingsLeafRoundedIcon color="disabled" />
                </Tooltip>
              )}
              {isRoot && (
                <Tooltip title={t("isTheRoot")} placement="bottom" arrow>
                  <ParkRoundedIcon color="disabled" />
                </Tooltip>
              )}
              {isBranch && (
                <Tooltip title={t("isABranch")} placement="bottom" arrow>
                  <AccountTreeRoundedIcon color="disabled" />
                </Tooltip>
              )}
              {isTree && (
                <Tooltip title={t("isATree")} placement="bottom" arrow>
                  <ForestRoundedIcon color="disabled" />
                </Tooltip>
              )}
            </Box>
          </Stack>
          <Stack direction="row" justifyContent="flex-end" spacing={0} alignSelf="flex-end">
            {!isRoot && (
              <Tooltip title={t("remove")} arrow>
                <Button
                  variant="text"
                  className={styles.ActionButton}
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
                  className={styles.ActionButton}
                  size="small"
                  onClick={() => onEditChildren?.(hierarchyPointNode)}
                >
                  <EditRoundedIcon />
                </Button>
              </Tooltip>
            )}
            {isLeaf && (
              <Tooltip title={t("add")} arrow>
                <Button
                  variant="text"
                  color="success"
                  className={styles.ActionButton}
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
                  className={styles.ActionButton}
                  size="small"
                  onClick={() => onOpenTreeModal?.(hierarchyPointNode)}
                >
                  <VisibilityRoundedIcon />
                </Button>
              </Tooltip>
            )}
          </Stack>
        </Box>
      </foreignObject>
    </g>
  );
};
export default memo(TreeCard);
