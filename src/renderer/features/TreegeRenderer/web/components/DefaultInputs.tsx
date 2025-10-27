import DefaultAddressInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultAddressInput";
import DefaultCheckboxInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultCheckboxInput";
import DefaultDateInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultDateInput";
import DefaultDateRangeInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultDateRangeInput";
import DefaultFileInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultFileInput";
import DefaultHiddenInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultHiddenInput";
import DefaultHttpInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultHttpInput";
import DefaultNumberInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultNumberInput";
import DefaultPasswordInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultPasswordInput";
import DefaultRadioInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultRadioInput";
import DefaultSelectInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultSelectInput";
import DefaultSwitchInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultSwitchInput";
import DefaultTextAreaInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultTextAreaInput";
import DefaultTextInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultTextInput";
import DefaultTimeInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultTimeInput";
import DefaultTimeRangeInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultTimeRangeInput";
import { InputRenderers, InputRenderProps } from "@/renderer/types/renderer";

// Re-export all components
export {
  DefaultAddressInput,
  DefaultCheckboxInput,
  DefaultDateInput,
  DefaultDateRangeInput,
  DefaultFileInput,
  DefaultHiddenInput,
  DefaultHttpInput,
  DefaultNumberInput,
  DefaultPasswordInput,
  DefaultRadioInput,
  DefaultSelectInput,
  DefaultSwitchInput,
  DefaultTextAreaInput,
  DefaultTextInput,
  DefaultTimeInput,
  DefaultTimeRangeInput,
};

// Wrapper for autocomplete to reuse text input with proper typing
const DefaultAutocompleteInput = (props: InputRenderProps<"autocomplete">) => {
  // Cast is safe because autocomplete and text have the same value type (string)
  return DefaultTextInput(props as unknown as InputRenderProps<"text">);
};

// Default input renderers mapping with proper typing
export const defaultInputRenderers: InputRenderers = {
  address: DefaultAddressInput,
  autocomplete: DefaultAutocompleteInput,
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
