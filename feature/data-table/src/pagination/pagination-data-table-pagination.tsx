"use client"
// The TanStack table instance is referentially stable, so React Compiler would cache
// `getState()` / `getCanNextPage()` / `getPageCount()` on first render and never advance.
"use no memo"

import { BookOpen, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Rows3 } from "lucide-react"
import { useTranslations } from "next-intl"

import { TooltipProvider } from "@/packages/ui/components/tooltip"

import { DATA_TABLE_PAGE_SIZE_OPTIONS, DATA_TABLE_PAGINATION_FOOTER_CLASS, isDataTablePageSize } from "../constants"
import { useDataTableContext } from "../core"
import { writeStoredDataTablePageSize } from "../utils"
import { PaginationNavButton } from "./pagination-nav-button"
import { PaginationPageSizeSelect } from "./pagination-page-size-select"
import { usePaginationNavLock } from "./pagination-use-pagination-nav-lock"

export function DataTablePagination<TData>() {
  const t = useTranslations()
  const { table, rowCount, limit: contextLimit, setPagination } = useDataTableContext<TData>()
  const { isLocked, runLockedAction, isActionLoading } = usePaginationNavLock()

  const limit = contextLimit ?? table.getState().pagination.pageSize
  const pagination = table.getState().pagination
  const total = rowCount ?? table.getFilteredRowModel().rows.length
  const pageIndex = pagination.pageIndex
  const start = total === 0 ? 0 : pageIndex * limit + 1
  const end = total === 0 ? 0 : Math.min(total, (pageIndex + 1) * limit)
  const rawPageCount = table.getPageCount()
  const resolvedPageCount =
    rawPageCount >= 0 ? rawPageCount : total === 0 ? 1 : Math.max(1, Math.ceil(total / limit))
  const pageCount = Math.max(1, resolvedPageCount)
  const lastPageIndex = pageCount - 1
  const canPreviousPage = pageIndex > 0
  const canNextPage = pageIndex < lastPageIndex

  const handlePageChange = (nextPageIndex: number, actionId: "first" | "previous" | "next" | "last") => {
    const target = Math.min(Math.max(0, nextPageIndex), lastPageIndex)
    if (target === pageIndex || !setPagination) {
      return
    }

    runLockedAction(actionId, () => {
      setPagination(target + 1, limit)
    })
  }

  const handlePageSizeChange = (size: number) => {
    if (!isDataTablePageSize(size) || size === limit || !setPagination) {
      return
    }

    runLockedAction("pageSize", () => {
      writeStoredDataTablePageSize(size)
      setPagination(1, size)
    })
  }

  return (
    <div className={DATA_TABLE_PAGINATION_FOOTER_CLASS}>
      <div className="flex max-w-52 shrink-0 items-center gap-1.5 text-muted-foreground text-xs">
        <Rows3
          aria-hidden="true"
          className="size-4 shrink-0"
        />
        <span>
          {total > 0 ? t("dataTable.pagination.showing", { start, end, total }) : t("dataTable.pagination.none")}
        </span>
      </div>
      <TooltipProvider>
        <div className="flex shrink-0 items-center">
          <div className="flex items-center justify-center px-1">
            <PaginationNavButton
              label={t("dataTable.pagination.first")}
              onClick={() => handlePageChange(0, "first")}
              disabled={!canPreviousPage || isLocked}
              loading={isActionLoading("first")}>
              <ChevronsLeft
                aria-hidden="true"
                focusable="false"
                className="rtl:rotate-180"
              />
            </PaginationNavButton>
          </div>
          <div className="flex items-center justify-center px-1">
            <PaginationNavButton
              label={t("dataTable.pagination.previous")}
              onClick={() => handlePageChange(pageIndex - 1, "previous")}
              disabled={!canPreviousPage || isLocked}
              loading={isActionLoading("previous")}>
              <ChevronLeft
                aria-hidden="true"
                focusable="false"
                className="rtl:rotate-180"
              />
            </PaginationNavButton>
          </div>
          <div className="flex items-center justify-center px-1">
            <div className="flex h-7 min-w-32 items-center justify-center gap-1.5 rounded-md border p-1 text-muted-foreground text-xs">
              <BookOpen
                aria-hidden="true"
                className="size-4 shrink-0 text-muted-foreground"
              />
              <span>
                {t("dataTable.pagination.pageOf", {
                  page: pageIndex + 1,
                  totalPages: pageCount,
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center px-1">
            <PaginationNavButton
              label={t("dataTable.pagination.next")}
              onClick={() => handlePageChange(pageIndex + 1, "next")}
              disabled={!canNextPage || isLocked}
              loading={isActionLoading("next")}>
              <ChevronRight
                aria-hidden="true"
                focusable="false"
                className="rtl:rotate-180"
              />
            </PaginationNavButton>
          </div>
          <div className="flex items-center justify-center px-1">
            <PaginationNavButton
              label={t("dataTable.pagination.last")}
              onClick={() => handlePageChange(lastPageIndex, "last")}
              disabled={!canNextPage || isLocked}
              loading={isActionLoading("last")}>
              <ChevronsRight
                aria-hidden="true"
                focusable="false"
                className="rtl:rotate-180"
              />
            </PaginationNavButton>
          </div>
        </div>
      </TooltipProvider>
      <div className="flex shrink-0 items-center">
        <PaginationPageSizeSelect
          value={`${limit}`}
          disabled={isLocked}
          onValueChange={(value) => {
            handlePageSizeChange(Number(value))
          }}
          options={DATA_TABLE_PAGE_SIZE_OPTIONS.map((size) => ({
            value: `${size}`,
            label: t("dataTable.pagination.rowsPerPage", { size }),
          }))}
        />
      </div>
    </div>
  )
}
