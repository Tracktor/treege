import * as React from "react";
import { cn } from "@/lib/utils";

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  return (

      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />

  )
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="form-description"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  FormItem,
  FormDescription,
}
