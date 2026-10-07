import {
  DATA_TABLE_PAGE_SIZE_STORAGE_KEY,
  type DataTablePageSize,
  DEFAULT_DATA_TABLE_PAGE_SIZE,
  isDataTablePageSize,
} from "../constants"

export function readStoredDataTablePageSize(): DataTablePageSize {
  if (typeof window === "undefined") {
    return DEFAULT_DATA_TABLE_PAGE_SIZE
  }

  try {
    const raw = localStorage.getItem(DATA_TABLE_PAGE_SIZE_STORAGE_KEY)
    if (!raw) {
      return DEFAULT_DATA_TABLE_PAGE_SIZE
    }

    const parsed = Number.parseInt(raw, 10)
    return isDataTablePageSize(parsed) ? parsed : DEFAULT_DATA_TABLE_PAGE_SIZE
  } catch {
    return DEFAULT_DATA_TABLE_PAGE_SIZE
  }
}

export function writeStoredDataTablePageSize(size: DataTablePageSize): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem(DATA_TABLE_PAGE_SIZE_STORAGE_KEY, String(size))
  } catch {
    // Quota exceeded, private browsing, or disabled storage.
  }
}
