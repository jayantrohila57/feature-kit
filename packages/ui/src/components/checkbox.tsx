"use client"

import type * as React from "react"

import { CheckIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/packages/ui/lib/utils"

const checkboxClassName =
  "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-muted-foreground/50 bg-background outline-none transition-shadow after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 group-has-disabled/field:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground dark:border-muted-foreground/80 dark:bg-transparent dark:data-[state=checked]:border-info dark:data-[state=checked]:bg-info dark:data-[state=checked]:text-background dark:data-[state=indeterminate]:border-info dark:data-[state=indeterminate]:bg-info dark:data-[state=indeterminate]:text-background dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkboxClassName, className)}
      {...props}>
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5">
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
