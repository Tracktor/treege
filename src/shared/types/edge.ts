export type EdgeOperator = "===" | "!==" | ">" | "<" | ">=" | "<=";
export type LogicalOperator = "AND" | "OR";

export type EdgeCondition = {
  field?: string;
  operator?: EdgeOperator;
  value?: string;
  logicalOperator?: LogicalOperator;
};

export type ConditionalEdgeData = {
  label?: string;
  conditions?: EdgeCondition[];
  /**
   * Whether this edge is a fallback/default path
   * Fallback edges are followed when no other conditional edges match
   */
  isFallback?: boolean;
};
