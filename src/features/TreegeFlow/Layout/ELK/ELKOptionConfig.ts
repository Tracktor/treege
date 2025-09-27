/**
 * Layout algorithm to use in ELK.
 */
export type ElkAlgorithm = "layered" | "force" | "mrtree";

/**
 * Direction in which layout flows (for the “layered” algorithm).
 */
export type ElkDirection = "DOWN" | "RIGHT" | "UP" | "LEFT";

/**
 * Edge routing style: orthogonal, polyline, or spline.
 */
export type ElkEdgeRouting = "ORTHOGONAL" | "POLYLINE" | "SPLINES";

/**
 * Whether to merge multiple parallel edges into one (to simplify routing).
 */
export type MergeOption = "true" | "false";

/**
 * Strategy for ordering nodes (model order, none, etc.).
 * (You may ajouter d’autres stratégies selon doc)
 */
export type NodeOrderStrategy = "DF_MODELORDER" | "NONE" | "SOME_OTHER";

/**
 * Strategy for placing nodes (interactive, simple, etc.).
 */
export type NodePlacementStrategy = "INTERACTIVE" | "SIMPLE" | "COMPACT";

/**
 * Fixed alignment for the BK node placement (left-up, balanced, etc.).
 */
export type BKFixedAlignment = "LEFTUP" | "RIGHTUP" | "BALANCED" | "LEFTDOWN" | "RIGHTDOWN";

/**
 * Types for ELK layout options.
 */
export interface ElkLayoutOptions {
  /** Which layout algorithm to use (e.g. “layered”). */
  "elk.algorithm"?: ElkAlgorithm;

  /** Global direction of the layout (DOWN, RIGHT, etc.). */
  "elk.direction"?: ElkDirection;

  /** How to route edges (orthogonal, spline, etc.). */
  "elk.edgeRouting"?: ElkEdgeRouting;

  /** If non-flow ports are allowed to switch sides. */
  "elk.layered.allowNonFlowPortsToSwitchSides"?: "true" | "false";

  /** Whether to merge multiple edges for routing simplicity. */
  "elk.layered.mergeEdges"?: MergeOption;

  /** Whether to merge hierarchy edges. */
  "elk.layered.mergeHierarchyEdges"?: MergeOption;

  /** Strategy for ordering nodes in layers. */
  "elk.layered.nodeOrder.strategy"?: NodeOrderStrategy;

  /** Whether to avoid edge crossings in node placement. */
  "elk.layered.nodePlacement.avoidEdgeCrossings"?: "true" | "false";

  /** Strategy used for node placement (interactive, simple, compact). */
  "elk.layered.nodePlacement.strategy"?: NodePlacementStrategy;

  /** Favor straight edges over other criteria. */
  "elk.layered.nodePlacement.favorStraightEdges"?: "true" | "false";

  /** Fixed alignment for BK (Brandes & Köpf) node placement. */
  "elk.layered.nodePlacement.bk.fixedAlignment"?: BKFixedAlignment;

  /** Spacing (vertical) between nodes across layers. */
  "elk.layered.spacing.nodeNodeBetweenLayers"?: string;

  /** Whether to remove unnecessary bendpoints. */
  "elk.layered.unnecessaryBendpoints"?: "true" | "false";

  /** Padding around the graph (e.g. “[top=…,left=…,bottom=…,right=…]”). */
  "elk.padding"?: string;

  /** Spacing between edges. */
  "elk.spacing.edgeEdge"?: string;

  /** Spacing between edge and node. */
  "elk.spacing.edgeNode"?: string;

  /** Spacing between nodes. */
  "elk.spacing.nodeNode"?: string;
}

const ELKOptionConfig: ElkLayoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.edgeRouting": "ORTHOGONAL",
  "elk.layered.mergeEdges": "false",
  "elk.layered.mergeHierarchyEdges": "false",
  "elk.layered.nodeOrder.strategy": "DF_MODELORDER",
  "elk.layered.nodePlacement.avoidEdgeCrossings": "true",
  "elk.layered.nodePlacement.bk.fixedAlignment": "LEFTUP",
  "elk.layered.nodePlacement.favorStraightEdges": "true",
  "elk.layered.nodePlacement.strategy": "INTERACTIVE",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.layered.unnecessaryBendpoints": "true",
  "elk.padding": "[top=150,left=150,bottom=150,right=150]",
  "elk.spacing.edgeEdge": "100",
  "elk.spacing.edgeNode": "100",
  "elk.spacing.nodeNode": "100",
};

export default ELKOptionConfig;
