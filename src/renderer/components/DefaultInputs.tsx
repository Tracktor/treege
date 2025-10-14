import { InputRenderProps } from "@/renderer/types/renderer";
import { renderLabel } from "@/renderer/utils/helpers";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export const DefaultTextInput = ({ node, value, onChange, error, context }: InputRenderProps) => {
  const name = node.data.name || `${node.id}`;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {renderLabel(node.data.label, context.language) || node.data.name}
        {node.data.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        type="text"
        id={name}
        name={name}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={node.data.placeholder}
      />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultNumberInput = ({ node, value, onChange, error, context }: InputRenderProps) => {
  const name = node.data.name || `${node.id}`;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {renderLabel(node.data.label, context.language) || node.data.name}
        {node.data.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        type="number"
        id={name}
        name={name}
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder={node.data.placeholder}
      />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultSelectInput = ({ node, value, onChange, error, context }: InputRenderProps) => {
  const name = node.data.name || `${node.id}`;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {renderLabel(node.data.label, context.language) || node.data.name}
        {node.data.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <select
        id={name}
        name={name}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-md"
      >
        <option value="">Sélectionnez une option</option>
        {node.data.options?.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {renderLabel(opt.label)}
          </option>
        ))}
      </select>
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultCheckboxInput = ({ node, value, onChange, error, context }: InputRenderProps) => {
  const name = node.data.name || `${node.id}`;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name} className="flex items-center">
        <Input
          type="checkbox"
          id={name}
          name={name}
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
          className="mr-2"
        />
        <span className="text-sm font-medium">
          {renderLabel(node.data.label, context.language) || node.data.name}
          {node.data.required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </Label>
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultSwitchInput = ({ node, value, onChange, error, context }: InputRenderProps) => {
  const name = node.data.name || `${node.id}`;

  return (
    <FormItem className="mb-4 flex items-center justify-between">
      <div>
        <Label htmlFor={name} className="block text-sm font-medium">
          {renderLabel(node.data.label, context.language) || node.data.name}
          {node.data.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
      </div>
      <Input
        type="checkbox"
        role="switch"
        id={name}
        name={name}
        checked={value || false}
        onChange={(e) => onChange(e.target.checked)}
        className="ml-4"
      />
      {error && <FormError>{error}</FormError>}
    </FormItem>
  );
};

export const DefaultRadioInput = ({ node, value, onChange, error, context }: InputRenderProps) => {
  const name = node.data.name || `${node.id}`;
  const firstOptionValue = node.data.options?.[0]?.value;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={firstOptionValue ? `${name}-${firstOptionValue}` : undefined} className="block text-sm font-medium mb-2">
        {renderLabel(node.data.label, context.language) || node.data.name}
        {node.data.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {node.data.options?.map((opt) => (
        <Label key={opt.value} htmlFor={`${name}-${opt.value}`} className="flex items-center mb-1">
          <Input
            type="radio"
            id={`${name}-${opt.value}`}
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={(e) => onChange(e.target.value)}
            disabled={opt.disabled}
            className="mr-2"
          />
          <span className="text-sm">{renderLabel(opt.label)}</span>
        </Label>
      ))}
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultDateInput = ({ node, value, onChange, error, context }: InputRenderProps) => {
  const name = node.data.name || `${node.id}`;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {renderLabel(node.data.label, context.language) || node.data.name}
        {node.data.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        type="date"
        id={name}
        name={name}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={node.data.placeholder}
      />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultTimeInput = ({ node, value, onChange, error, context }: InputRenderProps) => {
  const name = node.data.name || `${node.id}`;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {renderLabel(node.data.label, context.language) || node.data.name}
        {node.data.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        type="time"
        id={name}
        name={name}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={node.data.placeholder}
      />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultPasswordInput = ({ node, value, onChange, error, context }: InputRenderProps) => {
  const name = node.data.name || `${node.id}`;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {renderLabel(node.data.label, context.language) || node.data.name}
        {node.data.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        type="password"
        id={name}
        name={name}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={node.data.placeholder}
      />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultFileInput = ({ node, onChange, error, context }: InputRenderProps) => {
  const name = node.data.name || `${node.id}`;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {renderLabel(node.data.label, context.language) || node.data.name}
        {node.data.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        type="file"
        id={name}
        name={name}
        onChange={(e) => onChange(e.target.files?.[0])}
        multiple={node.data.multiple}
        placeholder={node.data.placeholder}
      />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultHiddenInput = ({ node, value }: InputRenderProps) => {
  const name = node.data.name || `${node.id}`;
  return <Input type="hidden" name={name} value={value || ""} />;
};

export const defaultInputRenderers = {
  address: DefaultTextInput,
  autocomplete: DefaultTextInput,
  checkbox: DefaultCheckboxInput,
  date: DefaultDateInput,
  daterange: DefaultDateInput,
  file: DefaultFileInput,
  hidden: DefaultHiddenInput,
  http: DefaultTextInput,
  number: DefaultNumberInput,
  password: DefaultPasswordInput,
  radio: DefaultRadioInput,
  select: DefaultSelectInput,
  switch: DefaultSwitchInput,
  text: DefaultTextInput,
  time: DefaultTimeInput,
  timerange: DefaultTimeInput,
};
