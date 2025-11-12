import { ReactNode } from "react";

export interface SubmitButtonWrapperProps {
  children: ReactNode;
  missingFields?: string[];
}

/**
 * Default submit button wrapper for React Native
 * Simple wrapper that renders children (no tooltip like web version)
 */
const DefaultSubmitButtonWrapper = ({ children }: SubmitButtonWrapperProps) => {
  return children;
};

export default DefaultSubmitButtonWrapper;
