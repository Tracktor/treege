import type { RawNodeDatum } from "react-d3-tree/lib/types/common";

export interface TreeRawNodeDatum extends RawNodeDatum {
  attributes: {
    depth: number;
    disable: boolean;
    required: boolean;
    type: "text" | "select";
  };
}
