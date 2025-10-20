import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { ChangeEvent, useState } from "react";
import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import DefaultHttpInput from "@/renderer/features/TreegeRenderer/web/components/DefaultHttpInput";
import { InputRenderProps } from "@/renderer/types/renderer";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { getTranslatedLabel } from "@/shared/utils/label";

export const DefaultTextInput = ({ node }: InputRenderProps) => {
  const { formValues, setFieldValue, formErrors, language } = useTreegeRendererContext();
  const fieldId = node.id;
  const value = formValues[fieldId];
  const error = formErrors[fieldId];
  const name = node.data.name || fieldId;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {getTranslatedLabel(node.data.label, language) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        type="text"
        id={name}
        name={name}
        value={value ?? ""}
        onChange={(e) => setFieldValue(fieldId, e.target.value)}
        placeholder={node.data.placeholder}
      />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultNumberInput = ({ node }: InputRenderProps) => {
  const { formValues, setFieldValue, formErrors, language } = useTreegeRendererContext();
  const fieldId = node.id;
  const value = formValues[fieldId];
  const error = formErrors[fieldId];
  const name = node.data.name || fieldId;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {getTranslatedLabel(node.data.label, language) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        type="number"
        id={name}
        name={name}
        value={value ?? ""}
        onChange={(e) => setFieldValue(fieldId, e.target.value === "" ? undefined : Number(e.target.value))}
        placeholder={node.data.placeholder}
      />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultSelectInput = ({ node }: InputRenderProps) => {
  const { formValues, setFieldValue, formErrors, language } = useTreegeRendererContext();
  const fieldId = node.id;
  const value = formValues[fieldId];
  const error = formErrors[fieldId];
  const name = node.data.name || fieldId;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {getTranslatedLabel(node.data.label, language) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Select value={value ?? ""} onValueChange={(val) => setFieldValue(fieldId, val)}>
        <SelectTrigger>
          <SelectValue placeholder={node.data.placeholder || ""} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {node.data.options?.map((opt, index) => (
              <SelectItem key={opt.value + index} value={opt.value} disabled={opt.disabled}>
                {getTranslatedLabel(opt.label)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultCheckboxInput = ({ node }: InputRenderProps) => {
  const { formValues, setFieldValue, formErrors, language } = useTreegeRendererContext();
  const fieldId = node.id;
  const value = formValues[fieldId];
  const error = formErrors[fieldId];
  const name = node.data.name || fieldId;

  // If there are options, render a checkbox group (multiple checkboxes)
  if (node.data.options && node.data.options.length > 0) {
    const selectedValues = Array.isArray(value) ? value : [];

    const handleCheckboxChange = (optionValue: string, checked: boolean) => {
      const newValues = checked ? [...selectedValues, optionValue] : selectedValues.filter((v) => v !== optionValue);
      setFieldValue(fieldId, newValues);
    };

    return (
      <FormItem className="mb-4">
        <Label className="block text-sm font-medium mb-2">
          {getTranslatedLabel(node.data.label, language) || node.data.name}
          {node.data.required && <span className="text-red-500">*</span>}
        </Label>
        <div className="space-y-2">
          {node.data.options.map((opt, index) => (
            <div key={opt.value + index} className="flex items-center gap-3">
              <Checkbox
                id={`${name}-${opt.value}`}
                checked={selectedValues.includes(opt.value)}
                onCheckedChange={(checked) => handleCheckboxChange(opt.value, checked as boolean)}
                disabled={opt.disabled}
              />
              <Label htmlFor={`${name}-${opt.value}`} className="text-sm font-normal cursor-pointer">
                {getTranslatedLabel(opt.label)}
              </Label>
            </div>
          ))}
        </div>
        {error && <FormError>{error}</FormError>}
        {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
      </FormItem>
    );
  }

  // Single checkbox (no options)
  return (
    <FormItem className="mb-4">
      <div className="flex items-center gap-3">
        <Checkbox id={name} checked={value || false} onCheckedChange={(checked) => setFieldValue(fieldId, checked)} />
        <div className="grid gap-2">
          <Label htmlFor={name} className="text-sm font-medium cursor-pointer">
            {getTranslatedLabel(node.data.label, language) || node.data.name}
            {node.data.required && <span className="text-red-500">*</span>}
          </Label>
          {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
        </div>
      </div>
      {error && <FormError>{error}</FormError>}
    </FormItem>
  );
};

export const DefaultSwitchInput = ({ node }: InputRenderProps) => {
  const { formValues, setFieldValue, formErrors, language } = useTreegeRendererContext();
  const fieldId = node.id;
  const value = formValues[fieldId];
  const error = formErrors[fieldId];
  const name = node.data.name || fieldId;

  return (
    <FormItem className="mb-4 flex items-center justify-between">
      <div>
        <Label htmlFor={name} className="block text-sm font-medium">
          {getTranslatedLabel(node.data.label, language) || node.data.name}
          {node.data.required && <span className="text-red-500">*</span>}
        </Label>
        {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
      </div>
      <Input
        type="checkbox"
        role="switch"
        id={name}
        name={name}
        checked={value || false}
        onChange={(e) => setFieldValue(fieldId, e.target.checked)}
        className="ml-4"
      />
      {error && <FormError>{error}</FormError>}
    </FormItem>
  );
};

export const DefaultRadioInput = ({ node }: InputRenderProps) => {
  const { formValues, setFieldValue, formErrors, language } = useTreegeRendererContext();
  const fieldId = node.id;
  const value = formValues[fieldId];
  const error = formErrors[fieldId];
  const name = node.data.name || fieldId;

  return (
    <FormItem className="mb-4">
      <Label className="block text-sm font-medium mb-2">
        {getTranslatedLabel(node.data.label, language) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <RadioGroup value={value || ""} onValueChange={(val) => setFieldValue(fieldId, val)}>
        {node.data.options?.map((opt, index) => (
          <div key={opt.value + index} className="flex items-center space-x-2">
            <RadioGroupItem value={opt.value} id={`${name}-${opt.value}`} disabled={opt.disabled} />
            <Label htmlFor={`${name}-${opt.value}`} className="text-sm font-normal cursor-pointer">
              {getTranslatedLabel(opt.label)}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultDateInput = ({ node }: InputRenderProps) => {
  const { formValues, setFieldValue, formErrors, language } = useTreegeRendererContext();
  const fieldId = node.id;
  const value = formValues[fieldId];
  const error = formErrors[fieldId];
  const name = node.data.name || fieldId;
  const [open, setOpen] = useState(false);

  // Convert value to Date object if it's a string
  const dateValue = value ? new Date(value) : undefined;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {getTranslatedLabel(node.data.label, language) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" id={name} className="w-full justify-between font-normal">
            {dateValue ? dateValue.toLocaleDateString() : node.data.placeholder || "Select date"}
            <ChevronDownIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            captionLayout="dropdown"
            onSelect={(date) => {
              setFieldValue(fieldId, date ? date.toISOString() : undefined);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultDateRangeInput = ({ node }: InputRenderProps) => {
  const { formValues, setFieldValue, formErrors, language } = useTreegeRendererContext();
  const fieldId = node.id;
  const value = formValues[fieldId];
  const error = formErrors[fieldId];
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  // Parse range value as array [startDate, endDate]
  const dateRange = Array.isArray(value) ? value : [];
  const startDate = dateRange[0] ? new Date(dateRange[0]) : undefined;
  const endDate = dateRange[1] ? new Date(dateRange[1]) : undefined;

  const handleStartDateSelect = (date: Date | undefined) => {
    setFieldValue(fieldId, [date ? date.toISOString() : undefined, dateRange[1]]);
    setOpenStart(false);
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setFieldValue(fieldId, [dateRange[0], date ? date.toISOString() : undefined]);
    setOpenEnd(false);
  };

  return (
    <FormItem className="mb-4">
      <Label>
        {getTranslatedLabel(node.data.label, language) || node.data.name}
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
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultTimeInput = ({ node }: InputRenderProps) => {
  const { formValues, setFieldValue, formErrors, language } = useTreegeRendererContext();
  const fieldId = node.id;
  const value = formValues[fieldId];
  const error = formErrors[fieldId];
  const name = node.data.name || fieldId;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {getTranslatedLabel(node.data.label, language) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        type="time"
        id={name}
        name={name}
        value={value || ""}
        onChange={(e) => setFieldValue(fieldId, e.target.value)}
        placeholder={node.data.placeholder}
        className="bg-background"
      />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultTimeRangeInput = ({ node }: InputRenderProps) => {
  const { formValues, setFieldValue, formErrors, language } = useTreegeRendererContext();
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
        {getTranslatedLabel(node.data.label, language) || node.data.name}
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
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultPasswordInput = ({ node }: InputRenderProps) => {
  const { formValues, setFieldValue, formErrors, language } = useTreegeRendererContext();
  const fieldId = node.id;
  const value = formValues[fieldId];
  const error = formErrors[fieldId];
  const name = node.data.name || fieldId;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {getTranslatedLabel(node.data.label, language) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        type="password"
        id={name}
        name={name}
        value={value ?? ""}
        onChange={(e) => setFieldValue(fieldId, e.target.value)}
        placeholder={node.data.placeholder}
      />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultFileInput = ({ node }: InputRenderProps) => {
  const { setFieldValue, formErrors, language } = useTreegeRendererContext();
  const fieldId = node.id;
  const error = formErrors[fieldId];
  const name = node.data.name || fieldId;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) {
      setFieldValue(fieldId, undefined);
      return;
    }

    // If multiple files are allowed, store as array, otherwise store single file
    if (node.data.multiple) {
      setFieldValue(fieldId, Array.from(files));
    } else {
      setFieldValue(fieldId, files[0]);
    }
  };

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {getTranslatedLabel(node.data.label, language) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        type="file"
        id={name}
        name={name}
        onChange={handleFileChange}
        multiple={node.data.multiple}
        placeholder={node.data.placeholder}
      />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultHiddenInput = ({ node }: InputRenderProps) => {
  const { formValues } = useTreegeRendererContext();
  const fieldId = node.id;
  const value = formValues[fieldId];
  const name = node.data.name || fieldId;
  return <Input type="hidden" name={name} value={value ?? ""} />;
};

export const DefaultTextAreaInput = ({ node }: InputRenderProps) => {
  const { formValues, setFieldValue, formErrors, language } = useTreegeRendererContext();
  const fieldId = node.id;
  const value = formValues[fieldId];
  const error = formErrors[fieldId];
  const name = node.data.name || fieldId;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {getTranslatedLabel(node.data.label, language) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id={name}
        name={name}
        value={value ?? ""}
        onChange={(e) => setFieldValue(fieldId, e.target.value)}
        placeholder={node.data.placeholder}
        className="w-full px-3 py-2 border rounded-md"
        rows={4}
      />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const defaultInputRenderers = {
  address: DefaultTextInput,
  autocomplete: DefaultTextInput,
  checkbox: DefaultCheckboxInput,
  date: DefaultDateInput,
  daterange: DefaultDateRangeInput,
  file: DefaultFileInput,
  hidden: DefaultHiddenInput,
  http: DefaultHttpInput,
  number: DefaultNumberInput,
  password: DefaultPasswordInput,
  radio: DefaultRadioInput,
  select: DefaultSelectInput,
  switch: DefaultSwitchInput,
  text: DefaultTextInput,
  textarea: DefaultTextAreaInput,
  time: DefaultTimeInput,
  timerange: DefaultTimeRangeInput,
};
