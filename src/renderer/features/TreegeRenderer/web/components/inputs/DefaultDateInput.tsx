import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Label } from "@/shared/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";

const DefaultDateInput = ({ node, value, setValue, error, label, placeholder, helperText }: InputRenderProps<"date">) => {
  const t = useTranslate();
  const name = node.data.name || node.id;
  const [open, setOpen] = useState(false);

  // Convert value to Date object if it's a string
  const dateValue = value ? new Date(value) : undefined;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {label || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" id={name} className="w-full justify-between font-normal">
            {dateValue ? dateValue.toLocaleDateString() : placeholder || t("renderer.defaultInputs.selectDate")}
            <ChevronDownIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            captionLayout="dropdown"
            onSelect={(date) => {
              setValue(date ? date.toISOString() : "");
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {error && <FormError>{error}</FormError>}
      {helperText && !error && <FormDescription>{helperText}</FormDescription>}
    </FormItem>
  );
};

export default DefaultDateInput;
