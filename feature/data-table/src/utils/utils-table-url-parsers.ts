import { createParser, parseAsInteger, parseAsString, parseAsStringLiteral } from "nuqs/server"

import {
  DATA_TABLE_MAX_PAGE_SIZE,
  DATA_TABLE_MIN_PAGE_SIZE,
  DEFAULT_DATA_TABLE_PAGE_SIZE,
  isDataTablePageSize,
} from "../constants"

/** 1-based page index stored in the URL. */
export const parseAsTablePage = parseAsInteger.withDefault(1)

/** Rows per page (`limit`); must match listing validation (20–1000). */
export const parseAsTablePageSize = createParser({
  parse(value) {
    const parsed = Number.parseInt(value, 10)
    if (!Number.isFinite(parsed) || parsed < DATA_TABLE_MIN_PAGE_SIZE || parsed > DATA_TABLE_MAX_PAGE_SIZE) {
      return null
    }
    return isDataTablePageSize(parsed) ? parsed : DEFAULT_DATA_TABLE_PAGE_SIZE
  },
  serialize(value) {
    return String(value)
  },
}).withDefault(DEFAULT_DATA_TABLE_PAGE_SIZE)

export const parseAsTableSearch = parseAsString

export const parseAsTableSortBy = parseAsString

export const parseAsTableSortDir = parseAsStringLiteral(["asc", "desc"] as const)

/** Shared nuqs map for table navigation state owned by the URL. */
export const tableUrlParsers = {
  page: parseAsTablePage,
  limit: parseAsTablePageSize,
  q: parseAsTableSearch,
  sortBy: parseAsTableSortBy,
  sortDir: parseAsTableSortDir,
} as const

/** Client-only URL updates for listing tables (no RSC refetch). */
export const tableUrlShallowUpdateOptions = {
  shallow: true,
  scroll: false,
  /** Keep defaults in the URL so table state is always bookmarkable. */
  clearOnDefault: false,
} as const

/** Trigger a server re-render when table navigation params change. */
export const tableUrlUpdateOptions = {
  shallow: false,
  scroll: false,
  /** Keep defaults in the URL so table state is always bookmarkable. */
  clearOnDefault: false,
} as const
