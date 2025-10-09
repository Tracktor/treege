import inputType from "@/constants/inputType";
import { TranslatableLabel } from "@/type/translate";

export type InputOption = {
  value: string;
  label: TranslatableLabel;
  disabled?: boolean;
};

export type InputType = (typeof inputType)[number];
