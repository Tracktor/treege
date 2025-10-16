import { ReactNode } from "react";
import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import type { NodeRenderProps } from "@/renderer/types/renderer";
import { getTranslatedLabel } from "@/shared/utils/label";

export const DefaultGroup = ({ node, children }: NodeRenderProps & { children: ReactNode }) => {
  const { language } = useTreegeRendererContext();

  return (
    <section className="mb-6 p-4 border rounded-lg ">
      {node.data.label && <h3 className="text-lg font-semibold mb-4">{getTranslatedLabel(node.data.label, language)}</h3>}
      <div>{children}</div>
    </section>
  );
};

export default DefaultGroup;
