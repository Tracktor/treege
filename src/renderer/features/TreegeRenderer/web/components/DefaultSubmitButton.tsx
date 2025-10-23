import { ButtonHTMLAttributes, ReactNode } from "react";

export type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

export type SubmitButtonWrapperProps = {
  children: ReactNode;
  missingFields?: string[];
};

/**
 * Default submit button
 */
const DefaultSubmitButton = ({ label = "Submit", ...props }: SubmitButtonProps) => (
  <button
    type="submit"
    className="mt-4 rounded-md bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    {...props}
  >
    {label}
  </button>
);

export default DefaultSubmitButton;
