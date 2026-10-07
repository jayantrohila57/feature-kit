/** Shared origin cookie bag for cross-app user preferences (theme, locale, formats…). */

export const PREFS_COOKIE_NAME = "aiq-prefs"

/** Legacy per-pref cookies — still read/mirrored during migration. */
export const LEGACY_THEME_COOKIE_NAME = "aiq-theme"
export const LEGACY_LOCALE_COOKIE_NAME = "NEXT_LOCALE"

/** next-themes localStorage key — must stay in sync with theme package. */
export const THEME_STORAGE_KEY = "theme"

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

export const sharedPrefsCookie = {
  name: PREFS_COOKIE_NAME,
  path: "/",
  maxAge: ONE_YEAR_SECONDS,
  sameSite: "lax" as const,
} as const

/**
 * Locales known to the portal (keep in sync with `feature/i18n` `locales`).
 * Bootstrap script embeds this list for pre-paint lang/dir.
 */
export const PREFS_LOCALES = ["en-IN", "hi-IN", "ur-IN", "en-US", "en-GB"] as const

export type PrefsLocale = (typeof PREFS_LOCALES)[number]

/** RTL locales — keep in sync with i18n language direction config. */
export const PREFS_RTL_LOCALES: readonly PrefsLocale[] = ["ur-IN"]
