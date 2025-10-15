import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import { InputRenderProps } from "@/renderer/types/renderer";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { getTranslatedLabel } from "@/shared/utils/label";

export const DefaultTextInput = ({ node }: InputRenderProps) => {
  const { getFieldValue, setFieldValue, errors, language } = useTreegeRendererContext();
  const name = node.data.name || `${node.id}`;
  const value = getFieldValue(name);
  const error = errors[name];

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
        value={value || ""}
        onChange={(e) => setFieldValue(name, e.target.value)}
        placeholder={node.data.placeholder}
      />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultNumberInput = ({ node }: InputRenderProps) => {
  const { getFieldValue, setFieldValue, errors, language } = useTreegeRendererContext();
  const name = node.data.name || `${node.id}`;
  const value = getFieldValue(name);
  const error = errors[name];

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
        value={value || ""}
        onChange={(e) => setFieldValue(name, Number(e.target.value))}
        placeholder={node.data.placeholder}
      />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultSelectInput = ({ node }: InputRenderProps) => {
  const { getFieldValue, setFieldValue, errors, language } = useTreegeRendererContext();
  const name = node.data.name || `${node.id}`;
  const value = getFieldValue(name);
  const error = errors[name];

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {getTranslatedLabel(node.data.label, language) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Select value={value || ""} onValueChange={(val) => setFieldValue(name, val)}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez une option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {node.data.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
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
  const { getFieldValue, setFieldValue, errors, language } = useTreegeRendererContext();
  const name = node.data.name || `${node.id}`;
  const value = getFieldValue(name);
  const error = errors[name];

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name} className="flex items-center">
        <Input
          type="checkbox"
          id={name}
          name={name}
          checked={value || false}
          onChange={(e) => setFieldValue(name, e.target.checked)}
          className="mr-2"
        />
        <span className="text-sm font-medium">
          {getTranslatedLabel(node.data.label, language) || node.data.name}
          {node.data.required && <span className="text-red-500">*</span>}
        </span>
      </Label>
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultSwitchInput = ({ node }: InputRenderProps) => {
  const { getFieldValue, setFieldValue, errors, language } = useTreegeRendererContext();
  const name = node.data.name || `${node.id}`;
  const value = getFieldValue(name);
  const error = errors[name];

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
        onChange={(e) => setFieldValue(name, e.target.checked)}
        className="ml-4"
      />
      {error && <FormError>{error}</FormError>}
    </FormItem>
  );
};

export const DefaultRadioInput = ({ node }: InputRenderProps) => {
  const { getFieldValue, setFieldValue, errors, language } = useTreegeRendererContext();
  const name = node.data.name || `${node.id}`;
  const value = getFieldValue(name);
  const error = errors[name];
  const firstOptionValue = node.data.options?.[0]?.value;

  return (
    <FormItem className="mb-4">
      <Label htmlFor={firstOptionValue ? `${name}-${firstOptionValue}` : undefined} className="block text-sm font-medium mb-2">
        {getTranslatedLabel(node.data.label, language) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      {node.data.options?.map((opt) => (
        <Label key={opt.value} htmlFor={`${name}-${opt.value}`} className="flex items-center mb-1">
          <Input
            type="radio"
            id={`${name}-${opt.value}`}
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={(e) => setFieldValue(name, e.target.value)}
            disabled={opt.disabled}
            className="mr-2"
          />
          <span className="text-sm">{getTranslatedLabel(opt.label)}</span>
        </Label>
      ))}
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultDateInput = ({ node }: InputRenderProps) => {
  const { getFieldValue, setFieldValue, errors, language } = useTreegeRendererContext();
  const name = node.data.name || `${node.id}`;
  const value = getFieldValue(name);
  const error = errors[name];

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {getTranslatedLabel(node.data.label, language) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        type="date"
        id={name}
        name={name}
        value={value || ""}
        onChange={(e) => setFieldValue(name, e.target.value)}
        placeholder={node.data.placeholder}
      />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultTimeInput = ({ node }: InputRenderProps) => {
  const { getFieldValue, setFieldValue, errors, language } = useTreegeRendererContext();
  const name = node.data.name || `${node.id}`;
  const value = getFieldValue(name);
  const error = errors[name];

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
        onChange={(e) => setFieldValue(name, e.target.value)}
        placeholder={node.data.placeholder}
      />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultPasswordInput = ({ node }: InputRenderProps) => {
  const { getFieldValue, setFieldValue, errors, language } = useTreegeRendererContext();
  const name = node.data.name || `${node.id}`;
  const value = getFieldValue(name);
  const error = errors[name];

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
        value={value || ""}
        onChange={(e) => setFieldValue(name, e.target.value)}
        placeholder={node.data.placeholder}
      />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultFileInput = ({ node }: InputRenderProps) => {
  const { setFieldValue, errors, language } = useTreegeRendererContext();
  const name = node.data.name || `${node.id}`;
  const error = errors[name];

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
        onChange={(e) => setFieldValue(name, e.target.files?.[0])}
        multiple={node.data.multiple}
        placeholder={node.data.placeholder}
      />
      {error && <FormError>{error}</FormError>}
      {node.data.helperText && !error && <FormDescription>{node.data.helperText}</FormDescription>}
    </FormItem>
  );
};

export const DefaultHiddenInput = ({ node }: InputRenderProps) => {
  const { getFieldValue } = useTreegeRendererContext();
  const name = node.data.name || `${node.id}`;
  const value = getFieldValue(name);
  return <Input type="hidden" name={name} value={value || ""} />;
};

export const DefaultTextAreaInput = ({ node }: InputRenderProps) => {
  const { getFieldValue, setFieldValue, errors, language } = useTreegeRendererContext();
  const name = node.data.name || `${node.id}`;
  const value = getFieldValue(name);
  const error = errors[name];

  return (
    <FormItem className="mb-4">
      <Label htmlFor={name}>
        {getTranslatedLabel(node.data.label, language) || node.data.name}
        {node.data.required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id={name}
        name={name}
        value={value || ""}
        onChange={(e) => setFieldValue(name, e.target.value)}
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
  textarea: DefaultTextAreaInput,
  time: DefaultTimeInput,
  timerange: DefaultTimeInput,
};
