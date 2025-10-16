import { useForm } from "@tanstack/react-form";
import { BaseEdge, Edge, EdgeLabelRenderer, EdgeProps, getBezierPath, useReactFlow } from "@xyflow/react";
import { Plus, Waypoints, X } from "lucide-react";
import { MouseEvent, useState } from "react";
import { useAvailableParentFields } from "@/editor/hooks/useAvailableParentFields";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { FormDescription, FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { LOGICAL_OPERATOR } from "@/shared/constants/operator";
import { ConditionalEdgeData } from "@/shared/types/edge";
import { LogicalOperator, Operator } from "@/shared/types/operator";

export type ConditionalEdgeType = Edge<ConditionalEdgeData, "conditional">;
export type ConditionalEdgeProps = EdgeProps<ConditionalEdgeType>;

const ConditionalEdge = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  data,
}: ConditionalEdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourcePosition,
    sourceX,
    sourceY,
    targetPosition,
    targetX,
    targetY,
  });

  const [isOpen, setIsOpen] = useState(false);
  const { updateEdgeData } = useReactFlow();
  const availableParentFields = useAvailableParentFields(target);
  const hasConditions = data?.conditions && data.conditions.length > 0;

  const { handleSubmit, reset, Field } = useForm({
    defaultValues: {
      conditions: data?.conditions || [{ field: source, operator: "===", value: "" }],
      isFallback: data?.isFallback || false,
      label: data?.label || "",
    },
    listeners: {
      onChange: ({ formApi }) => {
        formApi.handleSubmit().then();
      },
      onChangeDebounceMs: 150,
    },
    onSubmit: async ({ value }) => {
      updateEdgeData(id, value);
    },
  });

  const onEdgeClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const handleClear = () => {
    reset({ conditions: [], isFallback: false, label: "" });
    updateEdgeData(id, { conditions: undefined, isFallback: undefined, label: undefined });
  };

  const getConditionSummary = () => {
    // If fallback edge, show "Fallback" label
    if (data?.isFallback) {
      return data.label || "Fallback";
    }

    if (!hasConditions) return null;

    if (data.label) return data.label;

    const conditions = data.conditions!;
    if (conditions.length === 1) {
      const field = availableParentFields.find((f) => f.nodeId === conditions[0].field)?.label || conditions[0].field;
      return `${field} ${conditions[0].operator} ${conditions[0].value}`;
    }

    const andCount = conditions.filter((c) => c.logicalOperator === LOGICAL_OPERATOR.AND).length;
    const orCount = conditions.filter((c) => c.logicalOperator === LOGICAL_OPERATOR.OR).length;

    if (andCount > 0 && orCount === 0) {
      return `${conditions.length} conditions (AND)`;
    }
    if (orCount > 0 && andCount === 0) {
      return `${conditions.length} conditions (OR)`;
    }

    return `${conditions.length} conditions (mixed)`;
  };

  const getEdgeStrokeColor = () => {
    if (data?.isFallback) return "var(--color-chart-4)";
    if (hasConditions) return "var(--color-chart-2)";
    return "var(--color-chart-3)";
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: getEdgeStrokeColor(),
          strokeDasharray: data?.isFallback ? "5,5" : undefined,
          strokeWidth: hasConditions || data?.isFallback ? 2 : style?.strokeWidth,
        }}
      />

      <EdgeLabelRenderer>
        <div
          className="nodrag nopan absolute"
          style={{
            pointerEvents: "all",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={hasConditions || data?.isFallback ? "default" : "secondary"}
                className="h-8 px-2 text-xs"
                onClick={onEdgeClick}
              >
                <Waypoints className="w-3 h-3 mr-1" />
                {hasConditions || data?.isFallback ? getConditionSummary() : "Condition"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-1" align="center" onClick={(e) => e.stopPropagation()}>
              <ScrollArea className="flex flex-col max-h-150 p-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <div className="grid gap-5">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Display conditions</h4>
                      <p className="text-sm text-muted-foreground">This field will be shown if the following conditions are met.</p>
                    </div>

                    <div className="grid gap-4">
                      <Field name="label">
                        {(field) => (
                          <FormItem>
                            <Label htmlFor="label">Label (optional)</Label>
                            <Input
                              id="label"
                              placeholder="Ex: If eligible"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                            />
                            <FormDescription>Custom label for the condition button</FormDescription>
                          </FormItem>
                        )}
                      </Field>

                      <Field name="isFallback">
                        {(field) => (
                          <FormItem>
                            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
                              <Checkbox
                                id="isFallback"
                                checked={field.state.value}
                                onCheckedChange={(checked) => field.handleChange(checked as boolean)}
                              />
                              <div className="flex flex-col gap-1">
                                <Label htmlFor="isFallback" className="cursor-pointer font-medium">
                                  Fallback / Default path
                                </Label>
                                <FormDescription className="text-xs">
                                  This path will be followed when no other conditions match
                                </FormDescription>
                              </div>
                            </div>
                          </FormItem>
                        )}
                      </Field>

                      <Field name="conditions" mode="array">
                        {(conditionsField) => (
                          <div className="space-y-3">
                            <Label>Conditions</Label>

                            <div className="space-y-2">
                              {conditionsField.state.value?.map((_, index) => (
                                <div key={`condition-${index}`} className="space-y-2">
                                  <div className="p-3 border rounded-lg bg-muted/30 space-y-2">
                                    <Field name={`conditions[${index}].field`}>
                                      {(fieldField) => (
                                        <FormItem>
                                          <Label htmlFor={`field-${index}`}>Field</Label>
                                          <Select
                                            value={fieldField.state.value || ""}
                                            onValueChange={(value: string) => fieldField.handleChange(value)}
                                          >
                                            <SelectTrigger id={`field-${index}`} className="w-full">
                                              <SelectValue placeholder="Select a field" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {availableParentFields.length === 0 ? (
                                                <SelectItem value="none" disabled>
                                                  No fields available
                                                </SelectItem>
                                              ) : (
                                                availableParentFields.map((field) => (
                                                  <SelectItem key={field.nodeId} value={field.nodeId}>
                                                    {field.label} ({field.type})
                                                  </SelectItem>
                                                ))
                                              )}
                                            </SelectContent>
                                          </Select>
                                        </FormItem>
                                      )}
                                    </Field>

                                    <div className="flex gap-2">
                                      <Field name={`conditions[${index}].operator`}>
                                        {(operatorField) => (
                                          <FormItem>
                                            <Label htmlFor={`operator-${index}`}>Operator</Label>
                                            <Select
                                              value={operatorField.state.value || "==="}
                                              onValueChange={(value: Operator) => operatorField.handleChange(value)}
                                            >
                                              <SelectTrigger id={`operator-${index}`}>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="===">=</SelectItem>
                                                <SelectItem value="!==">≠</SelectItem>
                                                <SelectItem value=">">&gt;</SelectItem>
                                                <SelectItem value="<">&lt;</SelectItem>
                                                <SelectItem value=">=">&gt;=</SelectItem>
                                                <SelectItem value="<=">&lt;=</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </FormItem>
                                        )}
                                      </Field>

                                      <Field name={`conditions[${index}].value`}>
                                        {(valueField) => (
                                          <FormItem className="w-full">
                                            <Label htmlFor={`value-${index}`}>Value</Label>
                                            <Input
                                              id={`value-${index}`}
                                              placeholder="Ex: 18"
                                              value={valueField.state.value || ""}
                                              onChange={(e) => valueField.handleChange(e.target.value)}
                                            />
                                          </FormItem>
                                        )}
                                      </Field>
                                    </div>

                                    {conditionsField.state.value && conditionsField.state.value.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => {
                                          conditionsField.removeValue(index);
                                          handleSubmit().then();
                                        }}
                                      >
                                        <X className="w-4 h-4 mr-1" />
                                        Remove condition
                                      </Button>
                                    )}
                                  </div>

                                  {conditionsField.state.value && index < conditionsField.state.value.length - 1 && (
                                    <Field name={`conditions[${index}].logicalOperator`}>
                                      {(logicalField) => (
                                        <div className="flex justify-center">
                                          <Select
                                            value={logicalField.state.value || LOGICAL_OPERATOR.AND}
                                            onValueChange={(value: LogicalOperator) => logicalField.handleChange(value)}
                                          >
                                            <SelectTrigger className="w-32 h-9 font-semibold">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value={LOGICAL_OPERATOR.AND}>AND</SelectItem>
                                              <SelectItem value={LOGICAL_OPERATOR.OR}>OR</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      )}
                                    </Field>
                                  )}
                                </div>
                              ))}

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                  conditionsField.pushValue({
                                    field: source,
                                    logicalOperator: LOGICAL_OPERATOR.AND,
                                    operator: "===",
                                    value: "",
                                  });
                                  handleSubmit().then();
                                }}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add condition
                              </Button>
                            </div>
                          </div>
                        )}
                      </Field>
                    </div>

                    <div className="flex justify-end pt-2 gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={handleClear}>
                        <X className="w-4 h-4 mr-1" />
                        Clear
                      </Button>
                      <Button type="button" size="sm" onClick={() => setIsOpen(false)}>
                        Close
                      </Button>
                    </div>
                  </div>
                </form>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default ConditionalEdge;
