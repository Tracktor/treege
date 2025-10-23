import { ReactNode } from "react";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import type { NodeRenderProps } from "@/renderer/types/renderer";

export const DefaultGroup = ({ node, children }: NodeRenderProps & { children: ReactNode }) => {
  const t = useTranslate();

  return (
    <section className="mb-6 rounded-lg border p-4">
      {node.data.label && <h3 className="text-lg font-semibold mb-4">{t(node.data.label)}</h3>}
      {children}
    </section>
  );
};

export default DefaultGroup;
