import { PREFS_LOCALES, type PrefsLocale } from "../cookie/cookie-prefs-constants"

/**
 * Add a preference checklist:
 * 1. Add an optional field here + validate in `parseAppPreferences`.
 * 2. Add `apply-<name>.ts` and wire it into `apply-all` / the bootstrap IIFE.
 * 3. Merge via `persistAppPreferences({ … })` on change (sync cookie first).
 *
 * VALIDATION IS NOT OPTIONAL. Every value here reaches `Intl.*` constructors via
 * `packages/format`, and `Intl` throws `RangeError` on an unrecognised option
 * rather than ignoring it. The bag is parsed from the `aiq-prefs` cookie, which
 * is client-written — so an unvalidated field is a render crash reachable by
 * editing a cookie. `parseAppPreferences` drops anything it cannot vouch for.
 */
export type ThemePreference = "brand" | "light" | "dark" | "system"

export type DateTimeStyle = "full" | "long" | "medium" | "short"
export type HourCycle = "h11" | "h12" | "h23" | "h24"
export type FirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

export const DATE_TIME_STYLES: readonly DateTimeStyle[] = ["full", "long", "medium", "short"]
export const HOUR_CYCLES: readonly HourCycle[] = ["h11", "h12", "h23", "h24"]

export type AppPreferences = {
  theme?: ThemePreference
  locale?: PrefsLocale
  timezone?: string
  currency?: string
  numberingSystem?: string
  calendar?: string
  firstDayOfWeek?: FirstDayOfWeek
  dateStyle?: DateTimeStyle
  timeStyle?: DateTimeStyle
  hourCycle?: HourCycle
}

/** Patch bag — explicit `undefined` means "leave existing value" (see `mergeAppPreferences`). */
export type AppPreferencesPatch = {
  [K in keyof AppPreferences]?: AppPreferences[K] | undefined
}

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "brand" || value === "light" || value === "dark" || value === "system"
}

export function isPrefsLocale(value: unknown): value is PrefsLocale {
  return typeof value === "string" && (PREFS_LOCALES as readonly string[]).includes(value)
}

export function isDateTimeStyle(value: unknown): value is DateTimeStyle {
  return typeof value === "string" && (DATE_TIME_STYLES as readonly string[]).includes(value)
}

export function isHourCycle(value: unknown): value is HourCycle {
  return typeof value === "string" && (HOUR_CYCLES as readonly string[]).includes(value)
}

export function isFirstDayOfWeek(value: unknown): value is FirstDayOfWeek {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 6
}

/**
 * `Intl.supportedValuesOf` is the authoritative list but is comparatively slow
 * and allocates a fresh array per call, and this parse runs on every request
 * that reads the cookie. Build the sets once, lazily, and only if the runtime
 * has the API — Node 24 and current browsers do; the `undefined` fallback keeps
 * older runtimes on the probe path below rather than rejecting everything.
 */
function supportedSet(key: "calendar" | "numberingSystem"): ReadonlySet<string> | undefined {
  const supportedValuesOf = (Intl as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf
  if (typeof supportedValuesOf !== "function") return undefined

  try {
    return new Set(supportedValuesOf(key).map((entry) => entry.toLowerCase()))
  } catch {
    return undefined
  }
}

let calendarSet: ReadonlySet<string> | undefined | null = null
let numberingSystemSet: ReadonlySet<string> | undefined | null = null

/**
 * Zone validity is checked by CONSTRUCTION, not against
 * `Intl.supportedValuesOf("timeZone")` — that list holds only canonical IDs, so
 * ICU's `Asia/Calcutta` is present while the modern `Asia/Kolkata` is not. Every
 * alias (`America/Buenos_Aires`, `Asia/Saigon`, …) would be rejected the same
 * way. `Intl.DateTimeFormat` accepts aliases and throws exactly where a later
 * format call would, which is the failure we are guarding against.
 *
 * Results are memoised because this runs per request, and the cache is bounded
 * because the input is a forgeable cookie — otherwise unique hostile values
 * would grow it without limit.
 */
const TIME_ZONE_CACHE_LIMIT = 256
const timeZoneCache = new Map<string, boolean>()

export function isTimeZone(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0 || value.length > 64) return false

  const cached = timeZoneCache.get(value)
  if (cached !== undefined) return cached

  let valid: boolean
  try {
    new Intl.DateTimeFormat(undefined, { timeZone: value })
    valid = true
  } catch {
    valid = false
  }

  if (timeZoneCache.size >= TIME_ZONE_CACHE_LIMIT) timeZoneCache.clear()
  timeZoneCache.set(value, valid)
  return valid
}

export function isCurrencyCode(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z]{3}$/.test(value)
}

export function isNumberingSystem(value: unknown): value is string {
  if (typeof value !== "string" || !/^[a-z0-9]{3,8}$/i.test(value)) return false

  if (numberingSystemSet === null) numberingSystemSet = supportedSet("numberingSystem")
  if (numberingSystemSet) return numberingSystemSet.has(value.toLowerCase())

  try {
    new Intl.NumberFormat(undefined, { numberingSystem: value } as Intl.NumberFormatOptions)
    return true
  } catch {
    return false
  }
}

export function isCalendar(value: unknown): value is string {
  if (typeof value !== "string" || !/^[a-z0-9-]{3,20}$/i.test(value)) return false

  if (calendarSet === null) calendarSet = supportedSet("calendar")
  if (calendarSet) return calendarSet.has(value.toLowerCase())

  try {
    new Intl.DateTimeFormat(undefined, { calendar: value } as Intl.DateTimeFormatOptions)
    return true
  } catch {
    return false
  }
}

/** Parse unknown JSON into a sanitized preference bag (drops invalid fields). */
export function parseAppPreferences(value: unknown): AppPreferences {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {}
  }

  const record = value as Record<string, unknown>
  const prefs: AppPreferences = {}

  if (isThemePreference(record["theme"])) {
    prefs.theme = record["theme"]
  }
  if (isPrefsLocale(record["locale"])) {
    prefs.locale = record["locale"]
  }
  if (isTimeZone(record["timezone"])) {
    prefs.timezone = record["timezone"]
  }
  if (isCurrencyCode(record["currency"])) {
    prefs.currency = record["currency"].toUpperCase()
  }
  if (isNumberingSystem(record["numberingSystem"])) {
    prefs.numberingSystem = record["numberingSystem"]
  }
  if (isCalendar(record["calendar"])) {
    prefs.calendar = record["calendar"]
  }
  if (isFirstDayOfWeek(record["firstDayOfWeek"])) {
    prefs.firstDayOfWeek = record["firstDayOfWeek"]
  }
  if (isDateTimeStyle(record["dateStyle"])) {
    prefs.dateStyle = record["dateStyle"]
  }
  if (isDateTimeStyle(record["timeStyle"])) {
    prefs.timeStyle = record["timeStyle"]
  }
  if (isHourCycle(record["hourCycle"])) {
    prefs.hourCycle = record["hourCycle"]
  }

  return prefs
}

export function mergeAppPreferences(base: AppPreferences, patch: AppPreferencesPatch): AppPreferences {
  return {
    ...base,
    ...Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)),
  }
}

export function serializeAppPreferences(prefs: AppPreferences): string {
  return JSON.stringify(prefs)
}

export function preferencesEqual(a: AppPreferences, b: AppPreferences): boolean {
  return (
    a.theme === b.theme &&
    a.locale === b.locale &&
    a.timezone === b.timezone &&
    a.currency === b.currency &&
    a.numberingSystem === b.numberingSystem &&
    a.calendar === b.calendar &&
    a.firstDayOfWeek === b.firstDayOfWeek &&
    a.dateStyle === b.dateStyle &&
    a.timeStyle === b.timeStyle &&
    a.hourCycle === b.hourCycle
  )
}
