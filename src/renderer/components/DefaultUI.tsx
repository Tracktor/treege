import { getTranslatedLabel, UiRenderProps } from "@/renderer";
import { Separator } from "@/shared/components/ui/separator";

/**
 * A simple separator component to divide sections in the UI.
 * @param children
 * @constructor
 */
export const Divider = ({ node }: UiRenderProps) => <Separator>{getTranslatedLabel(node.data?.label)}</Separator>;

/**
 * A title component for section headings in the UI.
 * @param children
 * @constructor
 */
export const Title = ({ node }: UiRenderProps) => (
  <h2 className="text-2xl font-bold mb-6 text-center">{getTranslatedLabel(node.data?.label)}</h2>
);

export const defaultUI = {
  divider: Divider,
  title: Title,
};
