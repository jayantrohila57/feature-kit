"use client"

import type { ComponentProps, ReactNode } from "react"
import type { FieldSize } from "../constants"

import { CalendarIcon } from "lucide-react"

import { Button } from "@/packages/ui/components/button"
import { cn } from "@/packages/ui/lib/utils"

import { FIELD_CONTROL_HEIGHT_CLASS } from "../constants"

type FieldPickerTriggerProps = Omit<ComponentProps<typeof Button>, "children" | "size" | "variant"> & {
  id: string
  open?: boolean | undefined
  invalid?: boolean | undefined
  required?: boolean | undefined
  empty?: boolean | undefined
  size?: FieldSize | undefined
  placeholder?: string | undefined
  children: ReactNode
  icon?: ReactNode | undefined
}

/**
 * Shared combobox/date trigger. Must forward remaining button props so Radix
 * `PopoverTrigger asChild` can attach open/close handlers.
 */
export function FieldPickerTrigger({
  id,
  open,
  disabled,
  invalid,
  required,
  empty,
  size = "default",
  placeholder,
  children,
  icon,
  className,
  type = "button",
  ...props
}: FieldPickerTriggerProps) {
  return (
    <Button
      {...props}
      id={id}
      type={type}
      variant="outline"
      disabled={disabled}
      aria-invalid={invalid}
      aria-required={required}
      aria-expanded={open}
      data-empty={empty || undefined}
      data-field-name={id}
      className={cn(
        FIELD_CONTROL_HEIGHT_CLASS[size],
        "w-full justify-start px-2 font-normal data-[empty=true]:text-muted-foreground",
        className,
      )}>
      {icon ?? <CalendarIcon data-icon="inline-start" />}
      <span className="min-w-0 flex-1 truncate text-start">{empty ? (placeholder ?? "Select…") : children}</span>
    </Button>
  )
}
