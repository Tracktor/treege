import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { Box, Button, Chip, Stack, Tooltip } from "@mui/material";
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
          <Stack alignItems="flex-end">
            {nodeDatum?.attributes?.type && <h4 className={styles.Title}>{nodeDatum.name}</h4>}
            {nodeDatum?.attributes?.type && (
              <Chip color="secondary" size="small" label={t(`type.${nodeDatum?.attributes?.type}`, { ns: "form" })} />
            )}
            <Stack direction="row" spacing={0.5}>
              {nodeDatum?.attributes?.label && (
                <Chip color="secondary" size="small" variant="outlined" label={nodeDatum?.attributes?.label} />
              )}
              {nodeDatum?.attributes?.value && (
                <Chip color="success" size="small" variant="outlined" label={nodeDatum?.attributes?.value} />
              )}
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="flex-end" spacing={0} alignSelf="flex-end">
            {!isRootCard && (
              <Tooltip title={t("remove")}>
                <Button
                  variant="text"
                  className={styles.ActionButton}
                  color="warning"
                  onClick={() => onDeleteChildren?.(hierarchyPointNode)}
                >
                  <DeleteOutlineRoundedIcon />
                </Button>
              </Tooltip>
            )}
            {isFieldCard && (
              <Tooltip title={t("edit")}>
                <Button variant="text" color="info" className={styles.ActionButton} onClick={() => onEditChildren?.(hierarchyPointNode)}>
                  <EditRoundedIcon />
                </Button>
              </Tooltip>
            )}
            {!isFieldCard && (
              <Tooltip title={t("add")}>
                <Button variant="text" color="success" className={styles.ActionButton} onClick={() => onAddChildren?.(hierarchyPointNode)}>
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
