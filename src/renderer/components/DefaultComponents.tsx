import { FormEvent, ReactNode } from "react";
import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import { NodeRenderProps } from "@/renderer/types/renderer";
import { renderLabel } from "@/renderer/utils/helpers";

/**
 * Default group component wrapper
 */
export const DefaultGroup = ({ node, children }: NodeRenderProps & { children: ReactNode }) => {
  const { language } = useTreegeRendererContext();
  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50" id="exxxxx">
      {node.data.label && <h3 className="text-lg font-semibold mb-4">{renderLabel(node.data.label, language)}</h3>}
      <div>{children}</div>
    </div>
  );
};

/**
 * Default UI component (displays node label)
 */
export const DefaultUI = ({ node }: NodeRenderProps) => {
  const { language } = useTreegeRendererContext();
  return (
    <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500">
      <p className="text-sm">{renderLabel(node.data.label, language) || "UI Component"}</p>
    </div>
  );
};

/**
 * Default form wrapper
 */
export const DefaultFormWrapper = ({ children, onSubmit }: { children: ReactNode; onSubmit: (e: FormEvent) => void }) => (
  <form onSubmit={onSubmit} className="max-w-2xl mx-auto p-6 gap-y-3">
    {children}
  </form>
);
