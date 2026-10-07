import { DEFAULT_DATA_TABLE_PAGE_SIZE } from "../constants"

export type EmptyPagedList<T> = {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/** Empty table payload when a list request has no rows (or no usable envelope). */
export function emptyPagedList<T = never>(page = 1, limit: number = DEFAULT_DATA_TABLE_PAGE_SIZE): EmptyPagedList<T> {
  return {
    items: [],
    pagination: {
      page,
      limit,
      total: 0,
      totalPages: 0,
    },
  }
}
