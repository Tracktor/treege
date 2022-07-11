import type { RawNodeDatum } from "react-d3-tree/lib/types/common";

export interface TreeRawNodeDatum extends Omit<RawNodeDatum, "attributes"> {
  attributes: {
    data: {
      label: string;
      value: string;
    }[];
    depth: number;
    disabled: boolean;
    required: boolean;
    type: string;
  };
}
