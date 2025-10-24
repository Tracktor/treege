import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Label } from "@/shared/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";

const DefaultDateRangeInput = ({ node, value, setValue, error }: InputRenderProps) => {
  const t = useTranslate();
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  // Parse range value as array [startDate, endDate]
  const dateRange = Array.isArray(value) ? value : [];
  const startDate = dateRange[0] ? new Date(dateRange[0]) : undefined;
  const endDate = dateRange[1] ? new Date(dateRange[1]) : undefined;

  const handleStartDateSelect = (date: Date | undefined) => {
    setValue([date ? date.toISOString() : undefined, dateRange[1]]);
    setOpenStart(false);
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setValue([dateRange[0], date ? date.toISOString() : undefined]);
    setOpenEnd(false);
  };

  return (
    <FormItem className="mb-4">
      <Label>
        {t(node.data.label) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex gap-2">
        <Popover open={openStart} onOpenChange={setOpenStart}>
          <PopoverTrigger asChild className="flex-1">
            <Button variant="outline" className="w-full justify-between font-normal">
              {startDate ? startDate.toLocaleDateString() : "Start date"}
              <ChevronDownIcon className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              captionLayout="dropdown"
              onSelect={handleStartDateSelect}
              disabled={(date) => (endDate ? date > endDate : false)}
            />
          </PopoverContent>
        </Popover>
        <Popover open={openEnd} onOpenChange={setOpenEnd}>
          <PopoverTrigger asChild className="flex-1">
            <Button variant="outline" className="w-full justify-between font-normal">
              {endDate ? endDate.toLocaleDateString() : "End date"}
              <ChevronDownIcon className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              captionLayout="dropdown"
              onSelect={handleEndDateSelect}
              disabled={(date) => (startDate ? date < startDate : false)}
            />
          </PopoverContent>
        </Popover>
      </div>
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{t(node.data.helperText)}</FormDescription>}
    </FormItem>
  );
};

export default DefaultDateRangeInput;
