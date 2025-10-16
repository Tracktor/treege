import { Edge, Node } from "@xyflow/react";
import { useCallback, useMemo, useState } from "react";
import { FormValues } from "@/renderer/types/renderer";
import { evaluateConditions } from "@/renderer/utils/conditionEvaluator";
import { checkHasFormFieldValue } from "@/renderer/utils/form";
import { buildEdgeMap, buildIncomingEdgeMap, findStartNode, findVisibleNodes } from "@/renderer/utils/nodeVisibility";
import { ConditionalEdgeData } from "@/shared/types/edge";
import { TreegeNodeData } from "@/shared/types/node";
import { isInputNode } from "@/shared/utils/nodeTypeGuards";

/**
 * PURE STATE LOGIC HOOK
 *
 * This hook manages the internal form state and visibility logic.
 * It contains NO side effects (no useEffect).
 * All state is keyed by nodeId for uniqueness.
 *
 * Responsibilities:
 * - Form values state (keyed by nodeId)
 * - Errors state
 * - Node visibility calculation (progressive rendering)
 * - Form validation (built-in: required, pattern)
 * - End of path detection
 *
 * NOT responsible for:
 * - Export/conversion to external format (done in component)
 * - Side effects like onChange callbacks (done in component)
 * - Custom validation (passed to component)
 */

/**
 * Custom hook for TreegeRenderer - Pure state logic only
 *
 * @param nodes - All nodes from the editor
 * @param edges - All edges from the editor
 * @param initialValues - Initial form values (already initialized with defaults)
 * @returns Pure state and computed values (no side effects)
 */
export const useTreegeRenderer = (nodes: Node<TreegeNodeData>[], edges: Edge<ConditionalEdgeData>[], initialValues: FormValues = {}) => {
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const edgeMap = useMemo(() => buildEdgeMap(edges), [edges]);
  const incomingEdgeMap = useMemo(() => buildIncomingEdgeMap(edges), [edges]);
  const startNode = useMemo(() => findStartNode(nodes, incomingEdgeMap), [nodes, incomingEdgeMap]);

  /**
   * Calculate which nodes should be visible based on current form values
   * This implements progressive rendering:
   * 1. Start from the start node (always visible)
   * 2. Show next nodes only when:
   *    - Current node has a value (for input nodes)
   *    - Edge conditions are met (if any)
   * 3. This creates a step-by-step form experience
   */
  const visibleNodeIds = useMemo(() => {
    if (!startNode) return new Set<string>();

    return findVisibleNodes(startNode.id, nodeMap, edgeMap, formValues);
  }, [startNode, nodeMap, edgeMap, formValues]);

  /**
   * Get all visible nodes (including parent groups of visible nodes)
   */
  const visibleNodes = useMemo(() => {
    const visible = new Set(visibleNodeIds);

    // Add parent groups of visible nodes
    nodes.forEach((node) => {
      if (visibleNodeIds.has(node.id) && node.parentId) {
        visible.add(node.parentId);
      }
    });

    return nodes.filter((node) => visible.has(node.id));
  }, [nodes, visibleNodeIds]);

  /**
   * Get top-level visible nodes (nodes without parent or with invisible parent)
   */
  const topLevelNodes = useMemo(
    () => visibleNodes.filter((node) => !node.parentId || !visibleNodes.some((n) => n.id === node.parentId)),
    [visibleNodes],
  );

  /**
   * Check if we're at the end of a path (no more nodes can be revealed)
   * We're at the end when there are no outgoing edges from any visible node
   * that could potentially lead to new nodes
   */
  const isEndOfPath = useMemo(() => {
    // Check if there are any visible nodes with outgoing edges that could reveal new nodes
    const hasUnexploredPaths = visibleNodes.some((node) => {
      const outgoing = edgeMap.get(node.id) || [];

      return outgoing.some((edge) => {
        // If target is already visible, this edge won't reveal anything new
        if (visibleNodeIds.has(edge.target)) return false;

        // Check if this is an unconditional edge
        const conditions = edge.data?.conditions || [];
        if (conditions.length === 0) {
          // Unconditional edge to non-visible node - this should have been followed already
          // This means we're not at the end yet (edge will be followed when conditions are met)
          return true;
        }

        // For fallback edges, check if there are any other edges from the same source
        // that could match instead
        if (edge.data?.isFallback) {
          // Get all edges from the same source
          const edgesFromSource = edgeMap.get(node.id) || [];
          const nonFallbackEdges = edgesFromSource.filter((e) => !e.data?.isFallback && e.id !== edge.id);

          // Check if any non-fallback edge conditions are filled
          const hasFilledNonFallbackEdges = nonFallbackEdges.some((e) => {
            const conds = e.data?.conditions || [];
            if (conds.length === 0) return true; // Unconditional edge

            return conds.every((cond) => {
              if (!cond.field) return true;
              const fieldNode = nodeMap.get(cond.field);
              const fieldName = isInputNode(fieldNode) ? fieldNode.id : cond.field;
              return checkHasFormFieldValue(fieldName, formValues);
            });
          });

          // If non-fallback edges have conditions filled but none match, fallback is unexplored
          if (hasFilledNonFallbackEdges) {
            const anyNonFallbackMatches = nonFallbackEdges.some((e) => {
              const conds = e.data?.conditions || [];
              return evaluateConditions(conds, formValues, nodeMap);
            });

            // Fallback is unexplored only if no non-fallback edges match
            return !anyNonFallbackMatches;
          }

          // If non-fallback conditions are not filled, we might not need fallback
          return true;
        }

        // For regular conditional edges, check if the conditions COULD be met in the future
        // If all condition fields are already filled, check if conditions evaluate to true
        const allConditionFieldsFilled = conditions.every((cond) => {
          if (!cond.field) return true;

          const fieldNode = nodeMap.get(cond.field);
          const fieldName = isInputNode(fieldNode) ? fieldNode.id : cond.field;

          return checkHasFormFieldValue(fieldName, formValues);
        });

        // If not all fields are filled, we might follow this edge in the future
        if (!allConditionFieldsFilled) return true;

        // If all fields are filled, check if conditions evaluate to true
        // If false, this edge will never be followed, so it doesn't count as unexplored
        return evaluateConditions(conditions, formValues, nodeMap);
      });
    });

    // We're at the end if there are no unexplored paths
    return !hasUnexploredPaths;
  }, [visibleNodes, edgeMap, visibleNodeIds, nodeMap, formValues]);

  /**
   * Set field value and clear error for that field
   */
  const setFieldValue = useCallback((fieldName: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error when user types
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Check if form is valid based on visible input nodes
   */
  const checkValidForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    visibleNodes.forEach((node) => {
      if (isInputNode(node)) {
        const fieldName = node.id;
        const value = formValues[fieldName];

        // Required validation
        if (node.data.required) {
          if (value === undefined || value === null || value === "") {
            newErrors[fieldName] = node.data.errorMessage || "This field is required";
            return;
          }
        }

        // Pattern validation (only if value is not empty)
        if (value && node.data.pattern) {
          try {
            const regex = new RegExp(node.data.pattern);
            if (!regex.test(String(value))) {
              newErrors[fieldName] = node.data.errorMessage || "Invalid format";
            }
          } catch (e) {
            console.error(`Invalid pattern for field ${fieldName}:`, e);
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [visibleNodes, formValues]);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setFormValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    checkValidForm,
    errors,
    formValues,
    isEndOfPath,
    resetForm,
    setErrors,
    setFieldValue,
    topLevelNodes,
    visibleNodes,
  };
};
