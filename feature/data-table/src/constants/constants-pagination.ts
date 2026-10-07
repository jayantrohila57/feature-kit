export const DATA_TABLE_PAGE_SIZE_STORAGE_KEY = "dataTable:pageSize:v1" as const

export const DATA_TABLE_MIN_PAGE_SIZE = 20 as const
export const DATA_TABLE_MAX_PAGE_SIZE = 1000 as const

export const DEFAULT_DATA_TABLE_PAGE_SIZE = 20 as const

/** Minimum time pagination controls stay disabled after a click (anti-spam + loading affordance). */
export const DATA_TABLE_PAGINATION_LOCK_MS = 300 as const

export const DATA_TABLE_PAGE_SIZE_OPTIONS = [20, 50, 100, 250, 500, 1000] as const

export type DataTablePageSize = (typeof DATA_TABLE_PAGE_SIZE_OPTIONS)[number]

export function isDataTablePageSize(value: number): value is DataTablePageSize {
  return (DATA_TABLE_PAGE_SIZE_OPTIONS as readonly number[]).includes(value)
}
