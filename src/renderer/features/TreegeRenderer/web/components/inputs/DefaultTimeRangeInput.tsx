import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const DefaultTimeRangeInput = ({ node }: InputRenderProps) => {
  const { formValues, setFieldValue, formErrors } = useTreegeRendererContext();
  const t = useTranslate();
  const fieldId = node.id;
  const value = formValues[fieldId];
  const error = formErrors[fieldId];

  // Parse range value as array [startTime, endTime]
  const timeRange = Array.isArray(value) ? value : [];
  const startTime = timeRange[0] || "";
  const endTime = timeRange[1] || "";

  const handleStartTimeChange = (newValue: string) => {
    setFieldValue(fieldId, [newValue, timeRange[1]]);
  };

  const handleEndTimeChange = (newValue: string) => {
    setFieldValue(fieldId, [timeRange[0], newValue]);
  };

  return (
    <FormItem className="mb-4">
      <Label>
        {t(node.data.label) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex gap-2">
        <Input
          type="time"
          value={startTime}
          onChange={(e) => handleStartTimeChange(e.target.value)}
          placeholder="Start time"
          className="bg-background flex-1"
        />
        <Input
          type="time"
          value={endTime}
          onChange={(e) => handleEndTimeChange(e.target.value)}
          placeholder="End time"
          className="bg-background flex-1"
        />
      </div>
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{t(node.data.helperText)}</FormDescription>}
    </FormItem>
  );
};

export default DefaultTimeRangeInput;
