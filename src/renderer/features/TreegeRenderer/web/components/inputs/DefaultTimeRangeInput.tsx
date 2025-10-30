import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const DefaultTimeRangeInput = ({ node, value, setValue, error, label, helperText }: InputRenderProps<"timerange">) => {
  const t = useTranslate();

  // Parse range value as array [startTime, endTime]
  const timeRange = Array.isArray(value) ? value : [];
  const startTime = timeRange[0] || "";
  const endTime = timeRange[1] || "";

  const handleStartTimeChange = (newValue: string) => {
    setValue([newValue, endTime]);
  };

  const handleEndTimeChange = (newValue: string) => {
    setValue([startTime, newValue]);
  };

  return (
    <FormItem className="mb-4">
      <Label>
        {label || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex gap-2">
        <Input
          aria-label={`${label || node.data.name} - ${t("renderer.defaultInputs.startTime")}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${node.id}-error` : undefined}
          type="time"
          value={startTime}
          onChange={(e) => handleStartTimeChange(e.target.value)}
          placeholder={t("renderer.defaultInputs.startTime")}
          className="flex-1 bg-background [color-scheme:light] dark:[color-scheme:dark]"
        />
        <Input
          aria-label={`${label || node.data.name} - ${t("renderer.defaultInputs.endTime")}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${node.id}-error` : undefined}
          type="time"
          value={endTime}
          onChange={(e) => handleEndTimeChange(e.target.value)}
          placeholder={t("renderer.defaultInputs.endTime")}
          className="flex-1 bg-background [color-scheme:light] dark:[color-scheme:dark]"
        />
      </div>
      {error && <FormError>{error}</FormError>}
      {helperText && !error && <FormDescription>{helperText}</FormDescription>}
    </FormItem>
  );
};

export default DefaultTimeRangeInput;
