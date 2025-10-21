// Import all input components from the inputs/ directory
import DefaultAddressInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultAddressInput";
import DefaultCheckboxInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultCheckboxInput";
import DefaultDateInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultDateInput";
import DefaultDateRangeInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultDateRangeInput";
import DefaultEmailInput from "@/renderer/features/TreegeRenderer/web/components/inputs/DefaultEmailInput";
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

// Re-export all components
export {
  DefaultAddressInput,
  DefaultCheckboxInput,
  DefaultDateInput,
  DefaultDateRangeInput,
  DefaultEmailInput,
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

// Default input renderers mapping
export const defaultInputRenderers = {
  address: DefaultAddressInput,
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
