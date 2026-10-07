"use client"

import { Maximize2, Minimize2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/packages/ui/components/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/packages/ui/components/tooltip"

import { useDataTableContext } from "../core"

export function DataTableFullscreenToggle() {
  const t = useTranslations()
  const { fullscreenEnabled, isFullscreenOpen, setFullscreenOpen } = useDataTableContext()

  if (!fullscreenEnabled || !setFullscreenOpen) {
    return null
  }

  const label = isFullscreenOpen ? t("dataTable.fullscreen.exit") : t("dataTable.fullscreen.enter")

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setFullscreenOpen(!isFullscreenOpen)}
            aria-pressed={isFullscreenOpen}
            aria-label={label}>
            {isFullscreenOpen ? <Minimize2 aria-hidden /> : <Maximize2 aria-hidden />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
