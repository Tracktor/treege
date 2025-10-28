import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { UiRenderProps } from "@/renderer/types/renderer";
import { isStartNode } from "@/renderer/utils/flow";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/utils";

export const Divider = ({ node }: UiRenderProps) => {
  const t = useTranslate();
  const label = t(node.data?.label);

  if (label) {
    return (
      <div className="flex items-center gap-x-3">
        <Separator className="my-8 flex-1" />
        <h4 className="font-semibold text-sm">{label}</h4>
        <Separator className="my-8 flex-1" />
      </div>
    );
  }

  return <Separator className="my-8" />;
};

export const Title = ({ node }: UiRenderProps) => {
  const { edges } = useTreegeRendererContext();
  const t = useTranslate();
  const isFirst = isStartNode(node.id, edges);

  return <h2 className={cn("mb-5 font-bold text-2xl", !isFirst && "mt-10")}>{t(node.data?.label)}</h2>;
};
export const defaultUI = {
  divider: Divider,
  title: Title,
};
