import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EnergySavingsLeafRoundedIcon from "@mui/icons-material/EnergySavingsLeafRounded";
import type { HierarchyPointNode } from "d3-hierarchy";
import { Box, Button, Chip, Stack, Tooltip } from "design-system";
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
  const isValueCard = !isFieldCard;
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
            {isFieldCard && <h4 className={styles.Title}>{nodeDatum?.attributes?.label}</h4>}
            {isFieldCard && <Chip color="secondary" size="small" label={t(`type.${nodeDatum?.attributes?.type}`, { ns: "form" })} />}
            {nodeDatum?.attributes?.step && (
              <Chip
                color="secondary"
                size="small"
                variant="outlined"
                label={`${t("step", { ns: "form" })} ${nodeDatum?.attributes?.step}`}
              />
            )}
            <Stack spacing={0.5} alignItems="flex-end">
              {isValueCard && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip size="small" label={nodeDatum?.attributes?.label} variant="outlined" />
                  <Chip size="small" color="primary" label={nodeDatum?.attributes?.value} variant="outlined" />
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
          </Stack>
        </Box>
      </foreignObject>
    </g>
  );
};
export default TreeCard;
