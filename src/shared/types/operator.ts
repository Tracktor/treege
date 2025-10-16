import { LOGICAL_OPERATOR } from "@/shared/constants/operator";

/**
 * Operators for comparing values in conditions
 */
export type Operator = "===" | "!==" | ">" | "<" | ">=" | "<=";

/**
 * Logical operators for combining multiple conditions
 */
export type LogicalOperator = (typeof LOGICAL_OPERATOR)[keyof typeof LOGICAL_OPERATOR];
