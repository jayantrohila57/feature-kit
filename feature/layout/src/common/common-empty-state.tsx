import type { Route } from "next"
import type { ComponentType, ReactNode } from "react"

import Link from "next/link"

import { Button } from "@/packages/ui/components/button"
import { Card } from "@/packages/ui/components/card"
import { cn } from "@/packages/ui/lib/utils"

export type EmptyStateAction = {
  label: string
  url: string
}

export type EmptyStateIcon = ComponentType<{ className?: string }>

export type EmptyStateProps = {
  title: string
  description: string
  icons?: EmptyStateIcon[]
  /** Simple link CTA (data-table empty pattern). */
  action?: EmptyStateAction
  /** Custom CTAs (retry, app Link buttons, etc.). Prefer over `action` when both are set. */
  actions?: ReactNode
  className?: string
}

export function EmptyState({ title, description, icons = [], action, actions, className }: EmptyStateProps) {
  const [FirstIcon, SecondIcon, ThirdIcon] = icons
  const showIconCluster = icons.length === 3 && FirstIcon && SecondIcon && ThirdIcon
  const showSingleIcon = !showIconCluster && FirstIcon
  const footer =
    actions ??
    (action ? (
      <Button
        asChild
        variant="outline"
        className="mt-4 shadow-sm active:shadow-none">
        <Link href={action.url as Route}>{action.label}</Link>
      </Button>
    ) : null)

  return (
    <Card className="flex h-full min-h-128 w-full flex-1 flex-col overflow-visible border-0 bg-card p-4 shadow-none ring-0">
      <div
        className={cn(
          "flex h-full min-h-128 w-full flex-1 flex-col items-center justify-center text-center",
          "group rounded-lg border border-dashed bg-muted transition duration-500 hover:bg-muted/50 hover:duration-200",
          className,
        )}>
        {showIconCluster || showSingleIcon ? (
          <div className="isolate mb-4 flex w-full justify-center">
            {showIconCluster ? (
              <>
                <div className="relative top-1.5 left-2.5 grid size-24 -rotate-6 place-items-center rounded-xl bg-background ring-1 ring-border transition duration-500 group-hover:-translate-x-5 group-hover:-translate-y-0.5 group-hover:-rotate-12 group-hover:duration-200">
                  <FirstIcon
                    className="size-6 text-muted-foreground"
                    aria-hidden
                  />
                </div>
                <div className="relative z-10 grid size-24 place-items-center rounded-xl bg-background ring-1 ring-border transition duration-500 group-hover:-translate-y-0.5 group-hover:duration-200">
                  <SecondIcon
                    className="size-6 text-muted-foreground"
                    aria-hidden
                  />
                </div>
                <div className="relative top-1.5 right-2.5 grid size-24 rotate-6 place-items-center rounded-xl bg-background ring-1 ring-border transition duration-500 group-hover:translate-x-5 group-hover:-translate-y-0.5 group-hover:rotate-12 group-hover:duration-200">
                  <ThirdIcon
                    className="size-6 text-muted-foreground"
                    aria-hidden
                  />
                </div>
              </>
            ) : (
              <div className="grid size-24 place-items-center rounded-xl bg-background ring-1 ring-border transition duration-500 group-hover:-translate-y-0.5 group-hover:duration-200">
                <FirstIcon
                  className="size-6 text-muted-foreground"
                  aria-hidden
                />
              </div>
            )}
          </div>
        ) : null}
        <div className="isolate px-4">
          <h2 className="mt-6 font-medium text-2xl text-foreground">{title}</h2>
          <p className="mt-1 max-w-lg whitespace-pre-line text-muted-foreground">{description}</p>
          {footer ? (
            <div className={cn(!action || actions ? "mt-4 flex flex-wrap justify-center gap-2" : null)}>{footer}</div>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
