import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface NodeWrapperProps extends PropsWithChildren {
  inGroup: boolean;
}

const NodeWrapper = ({ children, inGroup }: NodeWrapperProps) => (
  <div className={cn("react-flow__node__wrapper", inGroup ? "in-group" : "")}>{children}</div>
);
export default NodeWrapper;
