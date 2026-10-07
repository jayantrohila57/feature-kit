import {
  type AppPreferences,
  mergeAppPreferences,
  preferencesEqual,
  serializeAppPreferences,
} from "../schema/schema-app-preferences"
import {
  LEGACY_LOCALE_COOKIE_NAME,
  LEGACY_THEME_COOKIE_NAME,
  PREFS_COOKIE_NAME,
  sharedPrefsCookie,
} from "./cookie-prefs-constants"
import { readAppPreferencesFromDocumentCookie } from "./cookie-prefs-read"

declare global {
  interface Window {
    /** Set by PreferenceBootstrapScript from NEXT_PUBLIC_COOKIE_DOMAIN. */
    __AIQ_PREFS_COOKIE_DOMAIN__?: string | undefined
  }
}

function buildCookieParts(name: string, value: string): string {
  const secure = typeof window !== "undefined" && window.location.protocol === "https:"
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `path=${sharedPrefsCookie.path}`,
    `max-age=${sharedPrefsCookie.maxAge}`,
    `samesite=${sharedPrefsCookie.sameSite}`,
  ]

  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    parts.push("domain=localhost")
  } else {
    // Preferences are shared with hosts outside this origin — notably the IdP,
    // which reads the theme so the login page matches the portal the user came
    // from. Without a domain the cookie is host-only and never reaches it.
    //
    // Sourced from NEXT_PUBLIC_COOKIE_DOMAIN via the bootstrap script rather
    // than derived from the hostname: guessing a parent domain gets
    // `example.co.uk` wrong, and a domain the browser rejects drops the cookie
    // entirely. Unset means host-only, i.e. exactly the previous behaviour.
    const shared = typeof window !== "undefined" ? window.__AIQ_PREFS_COOKIE_DOMAIN__ : undefined
    if (shared) parts.push(`domain=${shared}`)
  }

  if (secure) {
    parts.push("secure")
  }

  return parts.join("; ")
}

/**
 * Merge `patch` into the current bag and write `aiq-prefs` (+ legacy mirrors).
 * Returns the merged bag. Idempotent when already equal.
 */
export function writeAppPreferencesToDocumentCookie(patch: AppPreferences): AppPreferences {
  if (typeof document === "undefined") return patch

  const current = readAppPreferencesFromDocumentCookie()
  const merged = mergeAppPreferences(current, patch)
  if (preferencesEqual(current, merged)) {
    return merged
  }

  // biome-ignore lint/suspicious/noDocumentCookie: sync cookie write required before cross-app navigation / OAuth redirects.
  document.cookie = buildCookieParts(PREFS_COOKIE_NAME, serializeAppPreferences(merged))

  // Mirror legacy cookies so next-intl / existing theme SSR keep working during migration.
  if (merged.theme) {
    // biome-ignore lint/suspicious/noDocumentCookie: legacy theme mirror
    document.cookie = buildCookieParts(LEGACY_THEME_COOKIE_NAME, merged.theme)
  }
  if (merged.locale) {
    // biome-ignore lint/suspicious/noDocumentCookie: legacy NEXT_LOCALE mirror
    document.cookie = buildCookieParts(LEGACY_LOCALE_COOKIE_NAME, merged.locale)
  }

  return merged
}
