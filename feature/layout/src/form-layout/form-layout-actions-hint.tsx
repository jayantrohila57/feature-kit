import type { ReactNode } from "react"

import { cn } from "@/packages/ui/lib/utils"

import { FORM_LAYOUT_ACTIONS_HINT_CLASS } from "./constants"

type FormLayoutActionsHintProps = {
  children: ReactNode
  icon?: ReactNode
  className?: string
}

/** Left-aligned helper text in the fixed form footer (visible from `sm` and up). */
export function FormLayoutActionsHint({ children, icon, className }: FormLayoutActionsHintProps) {
  return (
    <div className={cn(FORM_LAYOUT_ACTIONS_HINT_CLASS, className)}>
      {icon}
      <span>{children}</span>
    </div>
  )
}
