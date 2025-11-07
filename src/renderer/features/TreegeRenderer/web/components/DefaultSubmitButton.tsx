import { ButtonHTMLAttributes, forwardRef } from "react";
import { useTranslate } from "@/renderer/hooks/useTranslate";

export interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

/**
 * Default submit button
 */
const DefaultSubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ label, id, disabled, onBlur, onClick, onFocus, onPointerDown, onPointerLeave, onPointerMove, ...props }, ref) => {
    const t = useTranslate();

    return (
      <button
        ref={ref}
        id={id}
        onBlur={onBlur}
        onClick={onClick}
        onFocus={onFocus}
        onPointerDown={onPointerDown}
        disabled={disabled}
        onPointerLeave={onPointerLeave}
        onPointerMove={onPointerMove}
        type="submit"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      >
        {label || t("renderer.defaultSubmitButton.submit")}
      </button>
    );
  },
);

export default DefaultSubmitButton;
