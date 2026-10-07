import {
  type AppPreferences,
  isPrefsLocale,
  isThemePreference,
  mergeAppPreferences,
  parseAppPreferences,
} from "../schema/schema-app-preferences"
import { LEGACY_LOCALE_COOKIE_NAME, LEGACY_THEME_COOKIE_NAME, PREFS_COOKIE_NAME } from "./cookie-prefs-constants"

function readCookieValue(cookieHeader: string | null | undefined, name: string): string | null {
  if (!cookieHeader) return null

  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim()
    const separator = trimmed.indexOf("=")
    if (separator === -1) continue

    if (trimmed.slice(0, separator).trim() !== name) continue
    return decodeURIComponent(trimmed.slice(separator + 1))
  }

  return null
}

/** Read + parse `aiq-prefs`, falling back to legacy theme/locale cookies. */
export function readAppPreferencesFromCookieHeader(cookieHeader: string | null | undefined): AppPreferences {
  const raw = readCookieValue(cookieHeader, PREFS_COOKIE_NAME)
  let prefs: AppPreferences = {}

  if (raw) {
    try {
      prefs = parseAppPreferences(JSON.parse(raw))
    } catch {
      prefs = {}
    }
  }

  if (!prefs.theme) {
    const legacyTheme = readCookieValue(cookieHeader, LEGACY_THEME_COOKIE_NAME)
    if (isThemePreference(legacyTheme)) {
      prefs = mergeAppPreferences(prefs, { theme: legacyTheme })
    }
  }

  if (!prefs.locale) {
    const legacyLocale = readCookieValue(cookieHeader, LEGACY_LOCALE_COOKIE_NAME)
    if (isPrefsLocale(legacyLocale)) {
      prefs = mergeAppPreferences(prefs, { locale: legacyLocale })
    }
  }

  return prefs
}

export function readAppPreferencesFromDocumentCookie(): AppPreferences {
  if (typeof document === "undefined") return {}
  return readAppPreferencesFromCookieHeader(document.cookie)
}
