import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EnergySavingsLeafRoundedIcon from "@mui/icons-material/EnergySavingsLeafRounded";
import { Box, Button, Chip, Stack, Tooltip, Typography } from "@mui/material";
import type { HierarchyPointNode } from "d3-hierarchy";
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
  hierarchyPointNode: HierarchyPointNode<TreeNode>;
}

const TreeCard = ({ nodeDatum, onAddChildren, onEditChildren, onDeleteChildren, hierarchyPointNode, size = 220 }: TreeCardProps) => {
  const { t } = useTranslation(["translation", "form"]);
  const isFieldCard = hierarchyPointNode?.data?.attributes?.type;
  const isRootCard = hierarchyPointNode?.data?.attributes?.isRoot;
  const isLeaf = hierarchyPointNode?.data?.attributes?.isLeaf;

  return (
    <g>
      <foreignObject
        height={size}
        width={size}
        x={`-${size / 2}`}
        y={`-${size / 2}`}
        className={isFieldCard ? styles.ContainerField : styles.ContainerValue}
      >
        <Box flex={1} display="flex" p={2} height="100%" flexDirection="column" justifyContent="space-between">
          <Stack alignItems="flex-end" spacing={0.5}>
            {nodeDatum?.attributes?.type && <h4 className={styles.Title}>{nodeDatum.name}</h4>}
            {nodeDatum?.attributes?.type && (
              <Chip color="secondary" size="small" label={t(`type.${nodeDatum?.attributes?.type}`, { ns: "form" })} />
            )}
            <Stack spacing={0.5} alignItems="flex-end">
              {nodeDatum?.attributes?.label && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip size="small" label={t("label")} className={styles.SmallChip} variant="outlined" />
                  <Typography variant="subtitle2">{nodeDatum?.attributes?.label}</Typography>
                </Stack>
              )}
              {nodeDatum?.attributes?.value && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip size="small" label={t("value")} className={styles.SmallChip} variant="outlined" color="primary" />
                  <Typography color="primary" variant="subtitle2">
                    <strong>{nodeDatum?.attributes?.value}</strong>
                  </Typography>
                </Stack>
              )}
            </Stack>
            <Box paddingTop={0.5}>
              <Tooltip title={t(isLeaf ? "isALeaf" : "isABranch")} placement="left">
                {isLeaf ? <EnergySavingsLeafRoundedIcon color="disabled" /> : <AccountTreeRoundedIcon color="disabled" />}
              </Tooltip>
            </Box>
          </Stack>
          <Stack direction="row" justifyContent="flex-end" spacing={0} alignSelf="flex-end">
            {!isRootCard && (
              <Tooltip title={t("remove")} arrow>
                <Button
                  variant="text"
                  className={styles.ActionButton}
                  size="small"
                  color="warning"
                  onClick={() => onDeleteChildren?.(hierarchyPointNode)}
                >
                  <DeleteOutlineRoundedIcon />
                </Button>
              </Tooltip>
            )}
            {isFieldCard && (
              <Tooltip title={t("edit")} arrow>
                <Button
                  variant="text"
                  color="info"
                  className={styles.ActionButton}
                  size="small"
                  onClick={() => onEditChildren?.(hierarchyPointNode)}
                >
                  <EditRoundedIcon />
                </Button>
              </Tooltip>
            )}
            {!isFieldCard && (
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
          </Stack>
        </Box>
      </foreignObject>
    </g>
  );
};
export default TreeCard;
