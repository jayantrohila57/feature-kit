import type { ReactNode } from "react"

import { cn } from "@/packages/ui/lib/utils"

type FormSectionProps = {
  title: string
  description?: string
  children: ReactNode
  className?: string
  required?: boolean
}

/**
 * One row of a page form: title and hint on the left, fields on the right.
 * Sections stack flush inside the form card and are separated by a hairline —
 * no grey panel behind them and no second box around the fields.
 */
export function FormSection({ title, description, children, className, required }: FormSectionProps) {
  return (
    <section
      className={cn(
        "grid h-auto w-full grid-cols-1 gap-x-8 gap-y-4 border-border border-b px-5 py-5 last:border-b-0 md:grid-cols-12",
        className,
      )}>
      <div className="md:col-span-4">
        <h2 className="font-semibold text-[14px] text-foreground leading-6">
          {title}
          {required ? (
            <span
              className="ms-1 text-destructive"
              aria-hidden="true">
              *
            </span>
          ) : null}
        </h2>
        {description ? <p className="mt-1 max-w-xs text-muted-foreground text-xs leading-5">{description}</p> : null}
      </div>
      <div className="grid min-h-16 w-full grid-cols-1 content-start gap-4 md:col-span-8 md:grid-cols-2">
        {children}
      </div>
    </section>
  )
}
