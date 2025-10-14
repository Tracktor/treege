import { FormEvent, ReactNode } from "react";
import { GroupRenderProps, JsonRenderProps, UIRenderProps } from "@/renderer/types/renderer";
import { renderLabel } from "@/renderer/utils/helpers";

/**
 * Default group component wrapper
 */
export const DefaultGroup = ({ node, children, context }: GroupRenderProps) => (
  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
    {node.data.label && <h3 className="text-lg font-semibold mb-4">{renderLabel(node.data.label, context.language)}</h3>}
    <div>{children}</div>
  </div>
);

/**
 * Default JSON component (displays JSON data)
 */
export const DefaultJson = ({ data }: JsonRenderProps) => (
  <div className="mb-4 p-4 bg-gray-100 rounded-md">
    <pre className="text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
  </div>
);

/**
 * Default UI component (displays node label)
 */
export const DefaultUI = ({ node, context }: UIRenderProps) => (
  <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500">
    <p className="text-sm">{renderLabel(node.data.label, context.language) || "UI Component"}</p>
  </div>
);

/**
 * Default form wrapper
 */
export const DefaultFormWrapper = ({ children, onSubmit }: { children: ReactNode; onSubmit: (e: FormEvent) => void }) => (
  <form onSubmit={onSubmit} className="max-w-2xl mx-auto p-6 gap-y-3">
    {children}
  </form>
);
