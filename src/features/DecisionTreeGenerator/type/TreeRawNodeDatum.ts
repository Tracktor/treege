export interface TreeRawNodeField {
  data?: never;
  disabled: boolean;
  required: boolean;
  type: string;
  depth: number;
}

export interface TreeRawNodeValues {
  disabled?: never;
  required?: never;
  type?: never;
  label: string;
  value: string;
  depth: number;
}

export type TreeRawNodeDatumAttributes = TreeRawNodeValues | TreeRawNodeField;

export interface TreeRawNodeDatum {
  name: string;
  attributes: TreeRawNodeDatumAttributes;
  children: TreeRawNodeDatum[];
}
