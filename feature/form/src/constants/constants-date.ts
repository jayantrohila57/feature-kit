export const DATE_ISO_PATTERN = /^\d{4}-\d{2}-\d{2}$/
export const DATE_ISO_PREFIX_PATTERN = /^(\d{4}-\d{2}-\d{2})/
export const MONTH_ISO_PATTERN = /^\d{4}-\d{2}$/
export const QUARTER_ISO_PATTERN = /^\d{4}-Q[1-4]$/
export const TIME_HM_PATTERN = /^\d{2}:\d{2}(:\d{2})?$/

export const DEFAULT_DATE_DISPLAY_FORMAT = "PPP"
export const DEFAULT_DATE_RANGE_DISPLAY_FORMAT = "LLL dd, y"
export const DEFAULT_MONTH_DISPLAY_FORMAT = "MMMM yyyy"

/** Year dropdown range when `captionLayout` is dropdown (account opening, branch start, …). */
export const DEFAULT_DATE_FROM_YEAR_OFFSET = 80
export const DEFAULT_DATE_TO_YEAR_OFFSET = 10

export const QUARTER_VALUES = [1, 2, 3, 4] as const

export type QuarterNumber = (typeof QUARTER_VALUES)[number]

export const QUARTER_LABELS: Record<QuarterNumber, string> = {
  1: "Q1",
  2: "Q2",
  3: "Q3",
  4: "Q4",
}

export const MONTH_INDEXES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const
