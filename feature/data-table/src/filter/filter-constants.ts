/** Versioned localStorage key prefix for per-table added-filter visibility. */
export const FILTER_STORAGE_KEY_PREFIX = "data-table:filters:v1:"

/** URL param prefix for column-specific text search (`cs.<key>=text`). */
export const FILTER_COLUMN_SEARCH_PARAM_PREFIX = "cs."

/** URL keys owned by the table but never treated as filters (pagination, sort, global search). */
export const FILTER_RESERVED_URL_KEYS = [
  "page",
  "limit",
  "q",
  "sortBy",
  "sortDir",
  /** Reconciliation setup masters — My actions view + bucket (not faceted table filters). */
  "view",
  "bucket",
] as const

/** Small info-blue dot shown on a header funnel when any capability of that column is active. */
export const FILTER_ACTIVE_DOT_CLASS =
  "pointer-events-none absolute -top-0.5 -end-0.5 size-1.5 rounded-full bg-info ring-1 ring-surface"

/** Toolbar filter chip trigger — outline control aligned with the applied-filters icon button. */
export const FILTER_CHIP_TRIGGER_CLASS = "h-7 gap-1 ps-2 pe-1 font-normal text-foreground"

/** Count pill inside a toolbar filter chip (`[2] selected`). */
export const FILTER_CHIP_COUNT_BADGE_CLASS =
  "min-w-4.5 justify-center rounded-full border-primary/30 bg-primary/10 px-1 font-medium text-primary tabular-nums"

/** Skeleton footprint for a toolbar filter chip while `localStorage` preferences hydrate. */
export const FILTER_CHIP_SKELETON_CLASS = "h-7 w-36 rounded-md"
