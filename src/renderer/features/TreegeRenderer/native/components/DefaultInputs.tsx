import { Text } from "react-native";
import DefaultCheckboxInput from "@/renderer/features/TreegeRenderer/native/components/inputs/DefaultCheckboxInput";
import DefaultHiddenInput from "@/renderer/features/TreegeRenderer/native/components/inputs/DefaultHiddenInput";
import DefaultNumberInput from "@/renderer/features/TreegeRenderer/native/components/inputs/DefaultNumberInput";
import DefaultPasswordInput from "@/renderer/features/TreegeRenderer/native/components/inputs/DefaultPasswordInput";
import DefaultRadioInput from "@/renderer/features/TreegeRenderer/native/components/inputs/DefaultRadioInput";
import DefaultSelectInput from "@/renderer/features/TreegeRenderer/native/components/inputs/DefaultSelectInput";
import DefaultSwitchInput from "@/renderer/features/TreegeRenderer/native/components/inputs/DefaultSwitchInput";
import DefaultTextareaInput from "@/renderer/features/TreegeRenderer/native/components/inputs/DefaultTextareaInput";
import DefaultTextInput from "@/renderer/features/TreegeRenderer/native/components/inputs/DefaultTextInput";
import { InputRenderers, InputRenderProps } from "@/renderer/types/renderer";

// TODO: Implement these React Native components (require external dependencies)
const PlaceholderInput = ({ node }: InputRenderProps<any>) => <Text>TODO: Implement {node.data.type} input for React Native</Text>;

// Vanilla React Native components (implemented)
export { DefaultTextInput, DefaultNumberInput, DefaultPasswordInput, DefaultTextareaInput };
export { DefaultCheckboxInput, DefaultSwitchInput, DefaultRadioInput, DefaultSelectInput };
export { DefaultHiddenInput };

// Placeholder exports for inputs requiring external libraries
export const DefaultAddressInput = PlaceholderInput;
export const DefaultAutocompleteInput = PlaceholderInput;
export const DefaultDateInput = PlaceholderInput;
export const DefaultDateRangeInput = PlaceholderInput;
export const DefaultFileInput = PlaceholderInput;
export const DefaultHttpInput = PlaceholderInput;
export const DefaultTimeInput = PlaceholderInput;
export const DefaultTimeRangeInput = PlaceholderInput;
export const DefaultSubmitInput = PlaceholderInput;

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
  submit: DefaultSubmitInput,
  switch: DefaultSwitchInput,
  text: DefaultTextInput,
  textarea: DefaultTextareaInput,
  time: DefaultTimeInput,
  timerange: DefaultTimeRangeInput,
};
