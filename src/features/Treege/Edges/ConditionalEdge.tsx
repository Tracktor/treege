import { useForm } from "@tanstack/react-form";
import { BaseEdge, Edge, EdgeLabelRenderer, EdgeProps, getBezierPath } from "@xyflow/react";
import { Waypoints, X } from "lucide-react";
import { MouseEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useFlow from "@/hooks/useFlow";

type Operator = "===" | "!==" | ">" | "<" | ">=" | "<=";

export type ConditionalEdgeData = {
  condition?: {
    label?: string;
    operator?: Operator;
    value?: string;
  };
};

export type ConditionalEdgeType = Edge<ConditionalEdgeData, "conditional">;

export type ConditionalEdgeProps = EdgeProps<ConditionalEdgeType>;

const ConditionalEdge = ({
  id,
  source,
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
  const [isOpen, setIsOpen] = useState(false);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourcePosition,
    sourceX,
    sourceY,
    targetPosition,
    targetX,
    targetY,
  });

  const { updateEdgeData, getNode } = useFlow();
  const parentNode = getNode(source);
  const parentLabel = parentNode?.data?.label ? String(parentNode?.data?.label) : source;

  const form = useForm({
    defaultValues: {
      label: data?.condition?.label || "",
      operator: data?.condition?.operator || "===",
      value: data?.condition?.value || "",
    },
    onSubmit: async ({ value }) => {
      updateEdgeData(id, {
        condition: value,
      });
    },
  });

  const onEdgeClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const handleClear = () => {
    form.reset();
    updateEdgeData(id, {
      condition: undefined,
    });
    setIsOpen(false);
  };

  const handleFormChange = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit().then();
  };

  const hasCondition = data?.condition?.operator && data?.condition?.value;

  return (
    <>
      {/* Edge */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: hasCondition ? "var(--color-chart-2)" : style?.stroke,
          strokeWidth: hasCondition ? 2 : style?.strokeWidth,
        }}
      />

      {/* Render button */}
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
              <Button variant={hasCondition ? "default" : "secondary"} className="h-8 px-2 text-xs" onClick={onEdgeClick}>
                {hasCondition ? (
                  <>
                    <Waypoints className="w-3 h-3 mr-1" />
                    {data?.condition?.label || `${parentLabel} ${data?.condition?.operator} ${data?.condition?.value}`}
                  </>
                ) : (
                  <>
                    <Waypoints className="w-3 h-3 mr-1" />
                    Condition
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="center" onClick={(e) => e.stopPropagation()}>
              <form onChange={handleFormChange}>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Display condition</h4>
                    <p className="text-sm text-muted-foreground">
                      This field will be shown if <span className="font-black">{parentLabel}</span> meets the condition.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {/* Label */}
                    <form.Field name="label">
                      {(field) => (
                        <div className="grid gap-2">
                          <Label htmlFor="label">Label (optional)</Label>
                          <Input
                            id="label"
                            placeholder="Ex: If is adult"
                            value={field.state.value}
                            onChange={({ target }) => field.handleChange(target.value)}
                          />
                        </div>
                      )}
                    </form.Field>

                    {/* Operator */}
                    <form.Field name="operator">
                      {(field) => (
                        <div className="grid gap-2">
                          <Label htmlFor="operator">Operator</Label>
                          <Select
                            value={field.state.value}
                            onValueChange={(value: Operator) => {
                              field.handleChange(value);
                            }}
                          >
                            <SelectTrigger id="operator">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="===">equal to (===)</SelectItem>
                              <SelectItem value="!==">not equal to (!==)</SelectItem>
                              <SelectItem value=">">greater than (&gt;)</SelectItem>
                              <SelectItem value="<">less than (&lt;)</SelectItem>
                              <SelectItem value=">=">greater than or equal to (≥)</SelectItem>
                              <SelectItem value="<=">less than or equal to (≤)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </form.Field>

                    {/* Value */}
                    <form.Field name="value">
                      {(field) => (
                        <div className="grid gap-2">
                          <Label htmlFor="value">Value</Label>
                          <Input
                            id="value"
                            placeholder="Ex: 18"
                            value={field.state.value}
                            onChange={({ target }) => field.handleChange(target.value)}
                          />
                        </div>
                      )}
                    </form.Field>
                  </div>

                  {/* Actions */}
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
            </PopoverContent>
          </Popover>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default ConditionalEdge;
