"use client"

import type { Route } from "next"
import type { RowActionComponentProps } from "../row-action-types"

import { Edit } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"

import { DropdownMenuItem } from "@/packages/ui/components/dropdown-menu"

export type RowActionEditProps<TData> = RowActionComponentProps<TData> & {
  /** Route or URL builder for navigation. */
  href?: string | ((data: TData) => string)
  /** Click handler when `href` is not provided. */
  onEdit?: (data: TData) => void
  label?: string
}

export function RowActionEdit<TData>({ data, href, onEdit, label }: RowActionEditProps<TData>) {
  const t = useTranslations()
  const resolvedHref = typeof href === "function" ? href(data) : href

  if (resolvedHref) {
    return (
      <DropdownMenuItem asChild>
        <Link href={resolvedHref as Route}>
          <Edit data-icon="inline-start" />
          {label ?? t("common.edit")}
        </Link>
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenuItem
      onClick={() => {
        onEdit?.(data)
      }}>
      <Edit data-icon="inline-start" />
      {label ?? t("common.edit")}
    </DropdownMenuItem>
  )
}
