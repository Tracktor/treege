import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { Box, Button, Chip, Stack, Tooltip } from "@mui/material";
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
          {nodeDatum?.attributes?.type && <h4 className={styles.Title}>{nodeDatum.name}</h4>}
          {nodeDatum?.attributes?.type && <Chip color="secondary" size="small" label={nodeDatum?.attributes?.type} />}
          <Stack direction="row" spacing={0.5}>
            {nodeDatum?.attributes?.label && <Chip color="success" size="small" variant="outlined" label={nodeDatum?.attributes?.label} />}
            {nodeDatum?.attributes?.value && <Chip color="success" size="small" variant="outlined" label={nodeDatum?.attributes?.value} />}
          </Stack>
        </Stack>
        <Stack direction="row" justifyContent="flex-end" spacing={0} alignSelf="flex-end">
          <Tooltip title="Editer">
            <Button variant="text" className={styles.ActionButton}>
              <EditRoundedIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Ajouter un champ">
            <Button variant="text" className={styles.ActionButton} onClick={() => onAddChildren?.(hierarchyPointNode)}>
              <AddBoxRoundedIcon />
            </Button>
          </Tooltip>
        </Stack>
      </Box>
    </foreignObject>
  </g>
);
export default TreeCard;
