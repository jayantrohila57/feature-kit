import { cn } from "@/packages/ui/lib/utils"

type DataTableFullscreenPlaceholderProps = {
  className?: string
}

export function DataTableFullscreenPlaceholder({ className }: DataTableFullscreenPlaceholderProps) {
  return (
    <div
      aria-hidden
      className={cn("mt-2 h-full min-h-96 rounded-lg border border-border bg-background/40", className)}
    />
  )
}
