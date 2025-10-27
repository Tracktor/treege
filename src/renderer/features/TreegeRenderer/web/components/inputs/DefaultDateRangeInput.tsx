import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Label } from "@/shared/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";

const DefaultDateRangeInput = ({ node, value, setValue, error }: InputRenderProps<"daterange">) => {
  const t = useTranslate();
  const [open, setOpen] = useState(false);

  // Parse range value as array [startDate, endDate]
  const dateRange = Array.isArray(value) ? value : [];
  const startDate = dateRange[0] ? new Date(dateRange[0]) : undefined;
  const endDate = dateRange[1] ? new Date(dateRange[1]) : undefined;

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setValue([range?.from ? range.from.toISOString() : undefined, range?.to ? range.to.toISOString() : undefined]);
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }
    if (startDate) {
      return startDate.toLocaleDateString();
    }
    return t("renderer.defaultInputs.selectDateRange");
  };

  return (
    <FormItem className="mb-4">
      <Label>
        {t(node.data.label) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between font-normal">
            {formatDateRange()}
            <ChevronDownIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            selected={{ from: startDate, to: endDate }}
            captionLayout="dropdown"
            onSelect={handleDateRangeSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{t(node.data.helperText)}</FormDescription>}
    </FormItem>
  );
};

export default DefaultDateRangeInput;
