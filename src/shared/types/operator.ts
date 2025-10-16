import { LOGICAL_OPERATOR } from "@/shared/constants/operator";

export type Operator = "===" | "!==" | ">" | "<" | ">=" | "<=";
export type LogicalOperator = (typeof LOGICAL_OPERATOR)[keyof typeof LOGICAL_OPERATOR];
