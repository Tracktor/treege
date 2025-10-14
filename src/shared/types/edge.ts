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
};
