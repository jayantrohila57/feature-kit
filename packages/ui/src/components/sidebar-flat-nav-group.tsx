"use client"

import type * as React from "react"

import { ChevronRight } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/packages/ui/components/collapsible"
import { SidebarMenuSub, useSidebar } from "@/packages/ui/components/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/packages/ui/components/tooltip"
import { TruncateTooltip } from "@/packages/ui/components/truncate-tooltip"
import { cn } from "@/packages/ui/lib/utils"

type SidebarFlatNavGroupProps = React.ComponentProps<typeof Collapsible> & {
  label: string
  icon?: React.ReactNode
  tooltip?: string
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}

/**
 * Flat sidebar section: icon + label, chevron toggle on the right, indented sub-list below.
 * Label and chevron both toggle open/closed. Collapsed sidebar shows icon only with tooltip.
 */
function SidebarFlatNavGroup({
  label,
  icon,
  tooltip,
  defaultOpen = false,
  children,
  className,
  ...props
}: SidebarFlatNavGroupProps) {
  const { isMobile, state } = useSidebar()
  const resolvedTooltip = tooltip ?? label

  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className={cn("group/flat-nav-group", className)}
      {...props}>
      <div
        className={cn(
          "flex h-8 w-full items-center gap-2 overflow-hidden rounded-[calc(var(--radius-sm)+2px)] p-2 text-xs outline-hidden",
          "text-sidebar-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2!",
          "[&_svg]:size-4 [&_svg]:shrink-0",
        )}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex shrink-0 items-center justify-center">{icon}</span>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            align="center"
            hidden={state !== "collapsed" || isMobile}>
            {resolvedTooltip}
          </TooltipContent>
        </Tooltip>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className={cn(
              "min-w-0 flex-1 text-start text-sidebar-foreground outline-hidden ring-sidebar-ring transition-colors",
              "hover:text-sidebar-accent-foreground",
              "focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-sidebar-ring/50",
              "group-data-[collapsible=icon]:hidden",
            )}>
            <TruncateTooltip side="right">{label}</TruncateTooltip>
          </button>
        </CollapsibleTrigger>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            aria-label={`Toggle ${label}`}
            className={cn(
              "ms-auto flex size-6 shrink-0 items-center justify-center rounded-md text-sidebar-foreground outline-hidden ring-sidebar-ring transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "focus-visible:ring-2 focus-visible:ring-sidebar-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar",
              "group-data-[collapsible=icon]:hidden",
            )}>
            <ChevronRight className="size-3.5 shrink-0 transition-transform duration-200 group-data-[state=open]/flat-nav-group:rotate-90" />
          </button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <SidebarMenuSub>{children}</SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

export { SidebarFlatNavGroup }
