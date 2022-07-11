import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { Box, Button, Chip, Stack } from "@mui/material";
import type { HierarchyPointNode } from "d3-hierarchy";
import type { CustomNodeElementProps, TreeNodeDatum } from "react-d3-tree/lib/types/common";
import styles from "./TreeCard.module.scss";

interface TreeCardProps extends CustomNodeElementProps {
  size?: number;
  onAddChildren?(hierarchyPointNode: HierarchyPointNode<TreeNodeDatum>): void;
}

const TreeCard = ({ nodeDatum, onAddChildren, hierarchyPointNode, size = 220 }: TreeCardProps) => (
  <g>
    <foreignObject height={size} width={size} x={`-${size / 2}`} className={styles.Container}>
      <Box flex={1} display="flex" p={2} height="100%" flexDirection="column" justifyContent="space-between">
        <Stack alignItems="flex-end">
          <h4 className={styles.Title}>{nodeDatum.name}</h4>
          <Chip color="secondary" size="small" label={nodeDatum?.attributes?.type} />
        </Stack>
        <Stack direction="row" justifyContent="flex-end" spacing={0} alignSelf="flex-end">
          <Button variant="text" className={styles.ActionButton}>
            <EditRoundedIcon />
          </Button>
          <Button variant="text" className={styles.ActionButton} onClick={() => onAddChildren?.(hierarchyPointNode)}>
            <AddBoxRoundedIcon />
          </Button>
        </Stack>
      </Box>
    </foreignObject>
  </g>
);
export default TreeCard;
