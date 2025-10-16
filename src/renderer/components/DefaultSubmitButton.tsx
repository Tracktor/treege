import { ButtonHTMLAttributes } from "react";

type DefaultSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

const DefaultSubmitButton = ({ label = "Submit" }: DefaultSubmitButtonProps) => (
  <button
    type="submit"
    className="mt-4 rounded-md bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {label}
  </button>
);

export default DefaultSubmitButton;
