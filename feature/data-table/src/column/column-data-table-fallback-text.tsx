"use client"

import { useTranslations } from "next-intl"

type DataTableColumnFallbackTextProps = {
  messageKey: "dataTable.column.noDescription" | "dataTable.column.notAvailable" | "dataTable.column.view"
  values?: Record<string, string | number>
}

export function DataTableColumnFallbackText({ messageKey, values }: DataTableColumnFallbackTextProps) {
  const t = useTranslations()
  return t(messageKey, values)
}

import { useFormat } from "format/hooks"

export function DataTablePostsCountLabel({ count }: { count: string | number }) {
  const t = useTranslations()
  const formatter = useFormat()
  const formattedCount = formatter.number(Number(count))
  return t("dataTable.column.postsPrefix", { count: formattedCount })
}
