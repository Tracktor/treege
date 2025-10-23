import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";
import { cn } from "@/shared/lib/utils";

const Label = ({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) => (
  <LabelPrimitive.Root
    data-slot="label"
    className={cn(
      "flex select-none items-center gap-2 font-medium text-muted-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
      className,
    )}
    {...props}
  />
);

export { Label };
