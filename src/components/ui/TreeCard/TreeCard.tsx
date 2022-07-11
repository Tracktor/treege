import AddCircleOutlineTwoToneIcon from "@mui/icons-material/AddCircleOutlineTwoTone";
import { Button, Stack } from "@mui/material";
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
      <Stack alignItems="center" justifyContent="center" flex={1} display="flex" height="100%" p={2}>
        {nodeDatum?.attributes?.type && <p>{nodeDatum?.attributes?.type}</p>}
        <Button variant="outlined" onClick={() => onAddChildren?.(hierarchyPointNode)}>
          <AddCircleOutlineTwoToneIcon />
        </Button>
      </Stack>
    </foreignObject>
  </g>
);
export default TreeCard;
