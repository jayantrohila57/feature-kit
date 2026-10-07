/**
 * Horizontal padding for data-table headers and body cells.
 *
 * Body cells use the shadcn `TableCell` default (`px-2`) plus an inner inset
 * (`px-1`) on column content — 12px total. Headers use the combined class
 * directly on `TableHead` so labels align with body text.
 */
export const DATA_TABLE_CELL_INSET_CLASS = "px-1 py-1"

/** Matches `TableCell` px-2 + {@link DATA_TABLE_CELL_INSET_CLASS} px-1. */
export const DATA_TABLE_HEAD_PADDING_X_CLASS = "px-3"

/**
 * Shared header menu trigger layout.
 *
 * Content-sized (`w-auto`) with a stable `gap` so icon + label + sort/filter
 * controls stay grouped. Avoid `w-full` + `justify-between` — that stretches
 * wide columns (huge empty gaps between label and sort icon).
 *
 * Keep `rounded-md` + padding so the Button focus ring is not a tight,
 * sharp rectangle around the text. Use `-mx-1.5` with `px-1.5` so the focus
 * ring has breathing room without shifting icon/label past body cell content
 * (TableHead `px-3` must stay flush with TableCell `px-2` + cell inset `px-1`).
 */
const DATA_TABLE_HEADER_TRIGGER_BASE =
  "flex h-auto min-h-0 w-auto shrink-0 flex-row items-center justify-start gap-1.5 rounded-md -mx-1.5 px-1.5 py-1 font-semibold text-foreground"

/** Sort-only (and shared) header menu trigger. */
export const DATA_TABLE_HEADER_TRIGGER_CLASS = DATA_TABLE_HEADER_TRIGGER_BASE

/** Faceted-filter headers: same trigger chrome as sort-only headers. */
export const DATA_TABLE_FILTER_HEADER_WRAPPER_CLASS = "flex shrink-0"

/** Filter header trigger: identical spacing/focus treatment to sort-only. */
export const DATA_TABLE_FILTER_HEADER_TRIGGER_CLASS = DATA_TABLE_HEADER_TRIGGER_BASE

/**
 * Count pill shown only on headers that have an active column filter. Info blue, not
 * red: an active filter is a state, not an error.
 */
export const DATA_TABLE_FILTER_HEADER_COUNT_BADGE_CLASS =
  "min-w-4.5 justify-center rounded-full border-info/40 bg-info px-1 font-medium text-[0.625rem] text-white tabular-nums"

/** Toolbar filter triggers — outline controls aligned with header “More filters” comboboxes. */
export const DATA_TABLE_TOOLBAR_FILTER_TRIGGER_CLASS = "h-7 gap-1.5 font-normal text-foreground"

/**
 * Left segment of the toolbar filter {@link ButtonGroup} (applied-filters funnel).
 * Disabled funnel stays full-opacity so its surface matches the Add filter segment.
 */
export const DATA_TABLE_TOOLBAR_FILTER_BUTTON_GROUP_LEFT_CLASS =
  "rounded-e-none disabled:opacity-100 disabled:hover:bg-background dark:disabled:hover:bg-input/30"

/** Horizontal inset for the bordered toolbar panel (search, filters, view options). */
export const DATA_TABLE_TOOLBAR_PANEL_CLASS = "px-2 py-0"

/**
 * Neutralizes table cell row height/padding when cell components are reused in
 * filter chips or column header filter menus.
 */
export const DATA_TABLE_FILTER_CONTENT_CLASS =
  "inline-flex min-w-0 items-center [&_div]:h-auto [&_div]:min-h-0 [&_div]:w-auto [&_div]:p-0"

/** Count pill on the toolbar Filters trigger. */
export const DATA_TABLE_FILTER_COUNT_BADGE_CLASS =
  "ms-0.5 min-w-4.5 justify-center rounded-full border-info/40 bg-info px-1 font-medium text-white tabular-nums"

/** Applied-filter popover — removable value chip (compact; aligns with toolbar h-7 controls). */
export const DATA_TABLE_APPLIED_FILTER_CHIP_CLASS =
  "inline-flex h-6 max-w-full min-w-0 items-center gap-0 rounded-md border border-border/80 bg-background py-0 ps-1.5 pe-0 text-xs leading-none text-foreground shadow-xs"

/**
 * Pagination footer — record count (start), page controls (center), page-size
 * select (end). `justify-between` spreads the three sections across the full
 * footer width; `flex-wrap` keeps narrow viewports usable.
 */
export const DATA_TABLE_PAGINATION_FOOTER_CLASS =
  "flex h-full w-full flex-row flex-wrap items-center justify-between gap-x-3 gap-y-1 px-2"

/** Active-filter summary chip under the toolbar (`Field: value ✕`) — info tint, matches the header funnel. */
export const DATA_TABLE_ACTIVE_FILTER_CHIP_CLASS =
  "inline-flex h-6 max-w-full min-w-0 items-center gap-1 rounded-full border border-info/30 bg-info/10 ps-2.5 pe-0.5 text-xs leading-none text-foreground"
