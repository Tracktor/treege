import { inputType } from "@/shared/constants/inputType";
import { TranslatableLabel } from "@/shared/types/translate";

export type InputOption = {
  value: string;
  label: TranslatableLabel;
  disabled?: boolean;
};

export type InputType = (typeof inputType)[number];
