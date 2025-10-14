import { FormValues } from "@/renderer/types/renderer";
import { EdgeCondition, EdgeOperator } from "@/shared/types/edge";

/**
 * Helper to check if a value is considered empty
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

/**
 * Normalize values for comparison
 * Handles string/number conversion and edge cases
 */
const normalizeValue = (value: any): string | number | boolean | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;

  // Convert arrays and objects to JSON strings for comparison
  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

/**
 * Compare two values using the specified operator
 */
const compareValues = (fieldVal: any, condVal: any, operator: EdgeOperator): boolean => {
  const normalizedFieldVal = normalizeValue(fieldVal);
  const normalizedCondVal = normalizeValue(condVal);

  // Handle null/undefined cases
  if (normalizedFieldVal === null || normalizedCondVal === null) {
    switch (operator) {
      case "===":
        return normalizedFieldVal === normalizedCondVal;
      case "!==":
        return normalizedFieldVal !== normalizedCondVal;
      default:
        return false; // Numeric comparisons with null are false
    }
  }

  // Try numeric comparison first for numeric operators
  if ([">", "<", ">=", "<="].includes(operator)) {
    const numFieldVal = Number(normalizedFieldVal);
    const numCondVal = Number(normalizedCondVal);

    // If both can be converted to valid numbers, use numeric comparison
    if (!Number.isNaN(numFieldVal) && !Number.isNaN(numCondVal)) {
      switch (operator) {
        case ">":
          return numFieldVal > numCondVal;
        case "<":
          return numFieldVal < numCondVal;
        case ">=":
          return numFieldVal >= numCondVal;
        case "<=":
          return numFieldVal <= numCondVal;
        default:
          return false;
      }
    }

    // If numeric comparison is not possible, return false
    return false;
  }

  // Equality operators
  switch (operator) {
    case "===": {
      // Try numeric comparison first
      const numFieldVal = Number(normalizedFieldVal);
      const numCondVal = Number(normalizedCondVal);

      if (!Number.isNaN(numFieldVal) && !Number.isNaN(numCondVal)) {
        return numFieldVal === numCondVal;
      }

      // Fall back to string comparison
      return String(normalizedFieldVal) === String(normalizedCondVal);
    }

    case "!==": {
      // Try numeric comparison first
      const numFieldVal = Number(normalizedFieldVal);
      const numCondVal = Number(normalizedCondVal);

      if (!Number.isNaN(numFieldVal) && !Number.isNaN(numCondVal)) {
        return numFieldVal !== numCondVal;
      }

      // Fall back to string comparison
      return String(normalizedFieldVal) !== String(normalizedCondVal);
    }

    default:
      return false;
  }
};

/**
 * Evaluates a single condition against form values
 */
export const evaluateCondition = (condition: EdgeCondition, formValues: FormValues): boolean => {
  const { field, operator, value } = condition;

  // If condition is incomplete, consider it as always true
  // This allows edges without conditions to always be followed
  if (!field || !operator || value === undefined) {
    return true;
  }

  const fieldValue = formValues[field];

  return compareValues(fieldValue, value, operator);
};

/**
 * Evaluates multiple conditions with logical operators (AND/OR)
 * Returns true if all conditions are met according to their logical operators
 */
export const evaluateConditions = (conditions: EdgeCondition[] | undefined, formValues: FormValues): boolean => {
  // No conditions means the edge should always be followed
  if (!conditions || conditions.length === 0) {
    return true;
  }

  // Single condition - just evaluate it
  if (conditions.length === 1) {
    return evaluateCondition(conditions[0], formValues);
  }

  // Multiple conditions - evaluate with logical operators
  let result = evaluateCondition(conditions[0], formValues);

  for (let i = 1; i < conditions.length; i += 1) {
    const condition = conditions[i];
    const conditionResult = evaluateCondition(condition, formValues);

    // The logical operator is stored on the PREVIOUS condition
    const logicalOperator = conditions[i - 1].logicalOperator || "AND";

    if (logicalOperator === "AND") {
      result = result && conditionResult;
      // Short-circuit: if result is false with AND, no need to continue
      if (!result) return false;
    } else if (logicalOperator === "OR") {
      result = result || conditionResult;
      // Short-circuit: if result is true with OR, no need to continue
      if (result) return true;
    }
  }

  return result;
};
