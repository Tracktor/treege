import { ButtonHTMLAttributes } from "react";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";

type DefaultSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
  missingFields?: string[];
};

const DefaultSubmitButton = ({ label = "Submit", missingFields = [], ...props }: DefaultSubmitButtonProps) => {
  const hasTooltip = missingFields.length > 0;
  const t = useTranslate();

  const button = (
    <button
      type="submit"
      className="mt-4 rounded-md bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    >
      {label}
    </button>
  );

  if (!hasTooltip) {
    return button;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">{t("renderer.defaultSubmitButton.requiredFieldsMissing")}:</p>
            <ul className="list-disc list-inside">
              {missingFields.map((field, index) => (
                <li key={index}>{field}</li>
              ))}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DefaultSubmitButton;
