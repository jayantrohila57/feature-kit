"use client"

import type { Route } from "next"
import type { RowActionComponentProps } from "../row-action-types"

import { Eye } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"

import { DropdownMenuItem } from "@/packages/ui/components/dropdown-menu"

export type RowActionViewProps<TData> = RowActionComponentProps<TData> & {
  /** Route or URL builder for navigation. */
  href?: string | ((data: TData) => string)
  /** Click handler when `href` is not provided. */
  onView?: (data: TData) => void
  label?: string
}

export function RowActionView<TData>({ data, href, onView, label }: RowActionViewProps<TData>) {
  const t = useTranslations()
  const resolvedHref = typeof href === "function" ? href(data) : href

  if (resolvedHref) {
    return (
      <DropdownMenuItem asChild>
        <Link href={resolvedHref as Route}>
          <Eye data-icon="inline-start" />
          {label ?? t("common.view")}
        </Link>
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenuItem
      onClick={() => {
        onView?.(data)
      }}>
      <Eye data-icon="inline-start" />
      {label ?? t("common.view")}
    </DropdownMenuItem>
  )
}
