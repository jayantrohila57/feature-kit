import type { NextResponse } from "next/server"

import { cookies } from "next/headers"

import {
  LEGACY_LOCALE_COOKIE_NAME,
  LEGACY_THEME_COOKIE_NAME,
  PREFS_COOKIE_NAME,
  sharedPrefsCookie,
} from "../cookie/cookie-prefs-constants"
import {
  type AppPreferences,
  isPrefsLocale,
  isThemePreference,
  mergeAppPreferences,
  parseAppPreferences,
  serializeAppPreferences,
  type ThemePreference,
} from "../schema/schema-app-preferences"

/** Match portal/host: explicit COOKIE_SECURE wins, else production default. */
function resolveCookieSecure(): boolean {
  const raw = process.env["COOKIE_SECURE"]
  if (raw === "true" || raw === "1") return true
  if (raw === "false" || raw === "0") return false
  return process.env["NODE_ENV"] === "production"
}

function prefsCookieOptions() {
  const isLocalStart = process.env["LOCAL_START"] === "1" || process.env["NODE_ENV"] === "development"
  return {
    path: sharedPrefsCookie.path,
    maxAge: sharedPrefsCookie.maxAge,
    sameSite: sharedPrefsCookie.sameSite,
    // Local multi-port apps use http://localhost — Secure cookies would be dropped.
    secure: isLocalStart ? false : resolveCookieSecure(),
    ...(isLocalStart ? { domain: "localhost" as const } : {}),
  }
}

export async function getAppPreferencesFromCookies(): Promise<AppPreferences> {
  const cookieStore = await cookies()
  let prefs: AppPreferences = {}

  const raw = cookieStore.get(PREFS_COOKIE_NAME)?.value
  if (raw) {
    try {
      prefs = parseAppPreferences(JSON.parse(raw))
    } catch {
      prefs = {}
    }
  }

  if (!prefs.theme) {
    const legacyTheme = cookieStore.get(LEGACY_THEME_COOKIE_NAME)?.value
    if (isThemePreference(legacyTheme)) {
      prefs = mergeAppPreferences(prefs, { theme: legacyTheme })
    }
  }

  if (!prefs.locale) {
    const legacyLocale = cookieStore.get(LEGACY_LOCALE_COOKIE_NAME)?.value
    if (isPrefsLocale(legacyLocale)) {
      prefs = mergeAppPreferences(prefs, { locale: legacyLocale })
    }
  }

  return prefs
}

export async function getPreferredThemeFromPrefs(): Promise<ThemePreference> {
  const prefs = await getAppPreferencesFromCookies()
  return prefs.theme ?? "brand"
}

export async function setAppPreferencesCookies(patch: AppPreferences) {
  const cookieStore = await cookies()
  const current = await getAppPreferencesFromCookies()
  const merged = mergeAppPreferences(current, patch)
  const options = prefsCookieOptions()

  cookieStore.set(PREFS_COOKIE_NAME, serializeAppPreferences(merged), options)
  if (merged.theme) {
    cookieStore.set(LEGACY_THEME_COOKIE_NAME, merged.theme, options)
  }
  if (merged.locale) {
    cookieStore.set(LEGACY_LOCALE_COOKIE_NAME, merged.locale, options)
  }
}

/** Write the full merged bag (+ legacy mirrors) onto a NextResponse. */
export function writeAppPreferencesCookies(response: NextResponse, merged: AppPreferences) {
  const options = prefsCookieOptions()
  response.cookies.set(PREFS_COOKIE_NAME, serializeAppPreferences(merged), options)
  if (merged.theme) {
    response.cookies.set(LEGACY_THEME_COOKIE_NAME, merged.theme, options)
  }
  if (merged.locale) {
    response.cookies.set(LEGACY_LOCALE_COOKIE_NAME, merged.locale, options)
  }
}
