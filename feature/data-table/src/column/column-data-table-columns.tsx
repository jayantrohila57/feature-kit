"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Route } from "next"
import type { ReactNode } from "react"

import { CurrencyCell, DateCell, NumberCell } from "format/ui"
import { Clock, ImageIcon, MoreHorizontal, Star } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/packages/ui/components/avatar"
import { Badge } from "@/packages/ui/components/badge"
import { Button } from "@/packages/ui/components/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/packages/ui/components/tooltip"
import { cn } from "@/packages/ui/lib/utils"

import { DATA_TABLE_CELL_INSET_CLASS } from "../constants"
import { type RowActionComponent, RowActionsMenu } from "../row-action"
import { colorClass, displayTypeOptions, statusOptions, visibilityOptions } from "../utils"
import { DataTableColumnHeader } from "./column-data-table-column-header"
import { DataTableColumnFallbackText, DataTablePostsCountLabel } from "./column-data-table-fallback-text"
import { DataTableSelectAllCheckbox, DataTableSelectRowCheckbox } from "./column-data-table-select-checkboxes"
import { STICKY_CELL_CONTENT_CLASS } from "./column-sticky-classes"

const ColumnCell = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div className={cn("line-clamp-1 gap-2 text-foreground text-sm", DATA_TABLE_CELL_INSET_CLASS, className)}>
      {children}
    </div>
  )
}
const keys = {
  ID: "id",
  SLUG: "slug",
  SELECT: "select",
  ACTIONS: "actions",
  VISIBILITY: "visibility",
  POSTS_COUNT: "postsCount",
  STATUS: "status",
  DESCRIPTION: "description",
  CREATED_AT: "createdAt",
  FULL_NAME: "fullName",
  DELETED_AT: "deletedAt",
  EMAIL: "email",
  NAME: "name",
  IMAGE: "image",
  DISPLAY_TYPE: "displayType",
  UPDATED_AT: "updatedAt",
  TITLE: "title",
  COLOR: "color",
  IS_FEATURED: "isFeatured",
  POPULARITY: "popularity",
  VALUE: "value",
  CURRENCY: "currency",
}

function idColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.ID,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.id"
        />
      ),
      cell: ({ row }) => {
        const id = String(row.getValue(keys.ID))
        return (
          <ColumnCell className="w-20">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="max-w-20 truncate text-muted-foreground text-sm">{id}</div>
              </TooltipTrigger>
              <TooltipContent>{id}</TooltipContent>
            </Tooltip>
          </ColumnCell>
        )
      },
    },
  ]
}
function titleColumn<T>(url: string): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.TITLE,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.title"
        />
      ),
      cell: ({ row }) => {
        const rawTitle = row.getValue(keys.TITLE)
        const slug = row.getValue(keys.SLUG) as string
        if (rawTitle == null || rawTitle === "") {
          return (
            <ColumnCell className="min-w-55 text-muted-foreground text-sm">
              <DataTableColumnFallbackText messageKey="dataTable.column.notAvailable" />
            </ColumnCell>
          )
        }
        const title = String(rawTitle)
        return (
          <ColumnCell className="min-w-55">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`${url}/${slug}` as Route}
                  className="max-w-55 truncate font-medium text-sm underline-offset-4 hover:underline">
                  {title}
                </Link>
              </TooltipTrigger>
              <TooltipContent>{title}</TooltipContent>
            </Tooltip>
          </ColumnCell>
        )
      },
    },
  ]
}
function selectColumn<T>({ selectAll = true }: { selectAll?: boolean } = {}): ColumnDef<T>[] {
  return [
    {
      id: keys.SELECT,
      meta: { sticky: "left", labelKey: "dataTable.column.selection", showSelectAllHeader: selectAll },
      header: selectAll ? ({ table }) => <DataTableSelectAllCheckbox table={table} /> : () => null,
      cell: ({ row }) => <DataTableSelectRowCheckbox row={row} />,
      enableSorting: false,
      enableHiding: false,
    },
  ]
}
function descriptionColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.DESCRIPTION,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.description"
        />
      ),
      cell: ({ row }) => {
        const rawDescription = row.getValue(keys.DESCRIPTION)
        const description = rawDescription == null || rawDescription === "" ? null : String(rawDescription)
        return (
          <ColumnCell className="min-w-55">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="max-w-55 truncate text-muted-foreground text-sm">
                  {description ?? <DataTableColumnFallbackText messageKey="dataTable.column.noDescription" />}
                </div>
              </TooltipTrigger>
              {description ? <TooltipContent>{description}</TooltipContent> : null}
            </Tooltip>
          </ColumnCell>
        )
      },
    },
  ]
}
function ActionsColumnHeader({ tooltipKey = "dataTable.column.rowActions" }: { tooltipKey?: string }) {
  const t = useTranslations()

  return (
    <div className={STICKY_CELL_CONTENT_CLASS}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex size-7 items-center justify-center"
            aria-label={t(tooltipKey)}>
            <MoreHorizontal
              className="size-4 text-muted-foreground"
              aria-hidden
            />
          </button>
        </TooltipTrigger>
        <TooltipContent>{t(tooltipKey)}</TooltipContent>
      </Tooltip>
    </div>
  )
}

function actionsColumn<T>(config: { actions: RowActionComponent<T>[]; headerTooltipKey?: string }): ColumnDef<T>[] {
  const { actions, headerTooltipKey } = config
  const labelKey = headerTooltipKey ?? "dataTable.column.rowActions"

  return [
    {
      id: keys.ACTIONS,
      meta: { sticky: "right", labelKey },
      enableSorting: false,
      enableHiding: false,
      header: () => <ActionsColumnHeader {...(headerTooltipKey ? { tooltipKey: headerTooltipKey } : {})} />,
      cell: ({ row }) => (
        <div className={STICKY_CELL_CONTENT_CLASS}>
          <RowActionsMenu
            row={row}
            actions={actions}
          />
        </div>
      ),
    },
  ]
}
function visibilityColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.VISIBILITY,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.visibility"
        />
      ),
      cell: ({ row }) => {
        const type = visibilityOptions.find((type) => type.value === row.getValue(keys.VISIBILITY))

        if (!type) return null

        return (
          <ColumnCell>
            <Badge variant={"outline"}>
              {type.icon ? (
                <type.icon
                  className="size-4"
                  data-icon="inline-start"
                />
              ) : null}
              {type.label}
            </Badge>
          </ColumnCell>
        )
      },

      filterFn: (row, id, value) => {
        const rowValue = row.getValue(id) ?? ""
        return (value as string[]).includes(rowValue as string)
      },
    },
  ]
}
function statusColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.STATUS,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.status"
        />
      ),
      cell: ({ row }) => {
        const status = statusOptions.find((status) => status.value === row.getValue(keys.STATUS))
        if (!status) return null
        return (
          <ColumnCell className="">
            <Badge variant={"outline"}>
              {status.icon ? (
                <status.icon
                  className="size-4"
                  data-icon="inline-start"
                />
              ) : null}
              <span>{status.label}</span>
            </Badge>
          </ColumnCell>
        )
      },

      filterFn: (row, id, value) => {
        const rowValue = row.getValue(id) ?? ""
        return (value as string[]).includes(rowValue as string)
      },
    },
  ]
}
function postsCountColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: "postsCount",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.postsCount"
        />
      ),
      cell: ({ row }) => (
        <ColumnCell className="flex items-center">
          <Badge variant={"outline"}>
            <DataTablePostsCountLabel count={String(row.getValue(keys.POSTS_COUNT))} />
          </Badge>
        </ColumnCell>
      ),
    },
  ]
}
function createdAtColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.createdAt"
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue(keys.CREATED_AT))
        return (
          <ColumnCell className="flex w-45 flex-row">
            <Badge variant={"outline"}>
              <Clock
                className="size-4"
                data-icon="inline-start"
              />
              <DateCell
                value={date}
                format="table"
              />
            </Badge>
          </ColumnCell>
        )
      },
    },
  ]
}
function updatedAtColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.updatedAt"
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue(keys.UPDATED_AT))
        return (
          <ColumnCell className="flex w-45 flex-row">
            <Badge variant={"outline"}>
              <Clock
                className="size-4"
                data-icon="inline-start"
              />
              <DateCell
                value={date}
                format="table"
              />
            </Badge>
          </ColumnCell>
        )
      },
    },
  ]
}
function deletedAtColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.DELETED_AT,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.deletedAt"
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue(keys.DELETED_AT))
        return (
          <ColumnCell className="flex w-45 flex-row">
            <Badge variant={"outline"}>
              <Clock
                className="size-4"
                data-icon="inline-start"
              />
              <DateCell
                value={date}
                format="table"
              />
            </Badge>
          </ColumnCell>
        )
      },
    },
  ]
}

function slugColumn<T>(url: string): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.SLUG,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.view"
        />
      ),
      cell: ({ row }) => (
        <ColumnCell className="flex w-30">
          <Link href={`${url}/${String(row.getValue(keys.SLUG))}` as Route}>
            <Button variant="link">
              <DataTableColumnFallbackText messageKey="dataTable.column.view" />
            </Button>
          </Link>
        </ColumnCell>
      ),
    },
  ]
}
function fullNameColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.FULL_NAME,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.name"
        />
      ),
      cell: ({ row }) => {
        return (
          <ColumnCell className="flex w-35 items-center gap-3">
            <div className="font-medium">{String(row.getValue(keys.FULL_NAME))}</div>
          </ColumnCell>
        )
      },
    },
  ]
}
function imageColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.IMAGE,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.image"
        />
      ),
      cell: ({ row }) => {
        const imageUrl = row.getValue(keys.IMAGE) || (row.original as unknown as { mediaUrl?: string })?.mediaUrl
        return (
          <ColumnCell className="w-30">
            <Avatar className="aspect-video h-12 w-auto rounded-sm object-cover">
              <AvatarImage
                src={imageUrl as string}
                alt="Image"
                className="aspect-video h-12 w-auto rounded-sm object-cover"
              />
              <AvatarFallback className="aspect-video h-12 w-auto rounded-sm object-cover">
                <ImageIcon className="opacity-50" />
              </AvatarFallback>
            </Avatar>
          </ColumnCell>
        )
      },
    },
  ]
}
function colorColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.COLOR,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.color"
        />
      ),
      cell: ({ row }) => {
        const color = String(row.getValue(keys.COLOR))
        return (
          <ColumnCell className="flex w-30">
            {color ? (
              color.startsWith("#") ? (
                <div
                  className="h-5 w-5 rounded-md border"
                  style={{ backgroundColor: color }}
                />
              ) : (
                <div
                  className={cn(
                    "rounded shadow-none transition-all duration-300",
                    "h-6 w-16",
                    colorClass[color as keyof typeof colorClass],
                  )}>
                  {color}
                </div>
              )
            ) : (
              <span className="text-muted-foreground">{" — "}</span>
            )}
          </ColumnCell>
        )
      },
    },
  ]
}
function isFeaturedColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.IS_FEATURED,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.featured"
        />
      ),
      cell: ({ row }) => (
        <ColumnCell className="flex w-30">
          {row.getValue(keys.IS_FEATURED) ? (
            <Badge
              variant="outline"
              className="border-amber-500/40 bg-amber-500/10">
              <Star className="h-4 w-4 text-amber-500" />
            </Badge>
          ) : (
            <span className="text-muted-foreground">{" — "}</span>
          )}
        </ColumnCell>
      ),
    },
  ]
}
function popularityColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.POPULARITY,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.popularity"
        />
      ),
      cell: ({ row }) => {
        const popularity = String(row.getValue(keys.POPULARITY))
        return (
          <ColumnCell className="flex w-30">
            {popularity ? (
              <div
                className="h-5 w-5 rounded-md border"
                style={{ backgroundColor: popularity }}
              />
            ) : (
              <span className="text-muted-foreground">{" — "}</span>
            )}
          </ColumnCell>
        )
      },
    },
  ]
}
function emailColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.EMAIL,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.email"
        />
      ),
      cell: ({ row }) => {
        const email = String(row.getValue(keys.EMAIL) ?? "")
        if (!email) {
          return (
            <ColumnCell className="min-w-55">
              <span className="text-muted-foreground text-sm">{" — "}</span>
            </ColumnCell>
          )
        }
        return (
          <ColumnCell className="min-w-55">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="max-w-55 truncate text-muted-foreground text-sm">{email}</div>
              </TooltipTrigger>
              <TooltipContent>{email}</TooltipContent>
            </Tooltip>
          </ColumnCell>
        )
      },
    },
  ]
}

function nameColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.NAME,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.name"
        />
      ),
      cell: ({ row }) => {
        const name = String(row.getValue(keys.NAME) ?? "")
        return (
          <ColumnCell className="min-w-55">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="max-w-55 truncate font-medium text-sm">{name}</div>
              </TooltipTrigger>
              <TooltipContent>{name}</TooltipContent>
            </Tooltip>
          </ColumnCell>
        )
      },
    },
  ]
}

function displayTypeColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.DISPLAY_TYPE,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.displayType"
        />
      ),
      cell: ({ row }) => {
        const type = displayTypeOptions.find((type) => type.value === row.getValue(keys.DISPLAY_TYPE))

        if (!type) return null

        return (
          <ColumnCell>
            <Badge variant={"outline"}>
              {type.icon ? (
                <type.icon
                  className="size-4"
                  data-icon="inline-start"
                />
              ) : null}
              {type.label}
            </Badge>
          </ColumnCell>
        )
      },

      filterFn: (row, id, value) => {
        const rowValue = row.getValue(id) ?? ""
        return (value as string[]).includes(rowValue as string)
      },
    },
  ]
}

function valueColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.VALUE,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.value"
        />
      ),
      cell: ({ row }) => {
        return (
          <ColumnCell className="flex w-55">
            <NumberCell value={row.getValue(keys.VALUE) as number} />
          </ColumnCell>
        )
      },
    },
  ]
}
function currencyColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.CURRENCY,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          titleKey="dataTable.column.currency"
        />
      ),
      cell: ({ row }) => {
        const currencyValue = row.getValue(keys.CURRENCY) as number | null | undefined
        return (
          <ColumnCell className="flex w-55">
            {currencyValue != null ? (
              <CurrencyCell value={currencyValue} />
            ) : (
              <DataTableColumnFallbackText messageKey="dataTable.column.notAvailable" />
            )}
          </ColumnCell>
        )
      },
    },
  ]
}
export const commonColumns = {
  keys,
  idColumn,
  titleColumn,
  selectColumn,
  descriptionColumn,
  actionsColumn,
  statusColumn,
  postsCountColumn,
  createdAtColumn,
  imageColumn,
  updatedAtColumn,
  slugColumn,
  fullNameColumn,
  colorColumn,
  isFeaturedColumn,
  popularityColumn,
  emailColumn,
  nameColumn,
  displayTypeColumn,
  deletedAtColumn,
  visibilityColumn,
  valueColumn,
  currencyColumn,
}
