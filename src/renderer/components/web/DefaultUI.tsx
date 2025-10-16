import { getTranslatedLabel, UiRenderProps } from "@/renderer";
import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import { Separator } from "@/shared/components/ui/separator";

export const Divider = ({ node }: UiRenderProps) => {
  const { language } = useTreegeRendererContext();
  return <Separator>{getTranslatedLabel(node.data?.label, language)}</Separator>;
};

export const Title = ({ node }: UiRenderProps) => {
  const { language } = useTreegeRendererContext();
  return <h2 className="text-2xl font-bold mb-6 text-center">{getTranslatedLabel(node.data?.label, language)}</h2>;
};
export const defaultUI = {
  divider: Divider,
  title: Title,
};
