import type { ReactElement } from "react"
import type { FieldOption } from "../field/field-types"

import { cn } from "@/packages/ui/lib/utils"

export function ComboboxOptionRow({
  option,
  truncateLabel = true,
}: {
  option: FieldOption
  /** False inside the open list so the popover can grow to fit labels. */
  truncateLabel?: boolean
}): ReactElement {
  const Icon = option.icon
  return (
    <span className={cn("flex items-center gap-2", truncateLabel ? "min-w-0" : "min-w-max")}>
      {Icon ? (
        <Icon
          className="size-3.5 shrink-0 text-muted-foreground"
          aria-hidden
        />
      ) : null}
      <span className={cn(truncateLabel ? "truncate" : "whitespace-nowrap")}>{option.label}</span>
    </span>
  )
}
