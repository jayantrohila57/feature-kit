"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/packages/ui/components/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/packages/ui/components/card"

interface DataTableErrorProps {
  error?: Error | string
  onRetry?: () => void
  title?: string
  description?: string
}

export function DataTableError({ error, onRetry, title, description }: DataTableErrorProps) {
  const t = useTranslations()
  const errorMessage = typeof error === "string" ? error : error?.message
  const resolvedTitle = title ?? t("dataTable.error.title")
  const resolvedDescription = description ?? t("dataTable.error.description")

  return (
    <Card className="h-full bg-destructive/5">
      <CardContent className="flex h-full flex-col items-center justify-center py-12">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="size-8 text-destructive" />
          </div>

          <div className="flex flex-col gap-2">
            <CardTitle className="text-lg">{resolvedTitle}</CardTitle>
            <CardDescription className="text-center">{resolvedDescription}</CardDescription>
            {errorMessage ? (
              <p className="rounded-md bg-muted p-2 text-muted-foreground text-sm">{errorMessage}</p>
            ) : null}
          </div>

          {onRetry ? (
            <Button
              type="button"
              onClick={onRetry}
              variant="outline">
              <RefreshCw data-icon="inline-start" />
              {t("error.boundary.retry")}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
