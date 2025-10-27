import { ReactNode } from "react";
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
import { InputRenderProps } from "@/renderer/types/renderer";

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

// Default input renderers mapping
export const defaultInputRenderers = {
  address: DefaultAddressInput as (props: InputRenderProps) => ReactNode,
  autocomplete: DefaultTextInput as (props: InputRenderProps) => ReactNode,
  checkbox: DefaultCheckboxInput as (props: InputRenderProps) => ReactNode,
  date: DefaultDateInput as (props: InputRenderProps) => ReactNode,
  daterange: DefaultDateRangeInput as (props: InputRenderProps) => ReactNode,
  file: DefaultFileInput as (props: InputRenderProps) => ReactNode,
  hidden: DefaultHiddenInput as (props: InputRenderProps) => ReactNode,
  http: DefaultHttpInput as (props: InputRenderProps) => ReactNode,
  number: DefaultNumberInput as (props: InputRenderProps) => ReactNode,
  password: DefaultPasswordInput as (props: InputRenderProps) => ReactNode,
  radio: DefaultRadioInput as (props: InputRenderProps) => ReactNode,
  select: DefaultSelectInput as (props: InputRenderProps) => ReactNode,
  switch: DefaultSwitchInput as (props: InputRenderProps) => ReactNode,
  text: DefaultTextInput as (props: InputRenderProps) => ReactNode,
  textarea: DefaultTextAreaInput as (props: InputRenderProps) => ReactNode,
  time: DefaultTimeInput as (props: InputRenderProps) => ReactNode,
  timerange: DefaultTimeRangeInput as (props: InputRenderProps) => ReactNode,
};
