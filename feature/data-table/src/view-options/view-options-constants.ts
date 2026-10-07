/** Legacy localStorage key prefix (visibility only). */
export const VIEW_OPTIONS_STORAGE_KEY_PREFIX_V1 = "data-table:columns:v1:"

/** Versioned localStorage key prefix for per-table column preferences. */
export const VIEW_OPTIONS_STORAGE_KEY_PREFIX = "data-table:columns:v2:"

/** Columns that cannot be hidden, reordered, or pinned from the column manager. */
export const LOCKED_COLUMN_IDS = new Set<string>(["expand", "select", "actions"])

/** Width of compact icon sticky columns (`w-10`). */
export const ICON_STICKY_COLUMN_WIDTH_PX = 40

/** Fallback width when a pinned data column has no explicit size. */
export const DEFAULT_PINNED_DATA_COLUMN_WIDTH_PX = 150
