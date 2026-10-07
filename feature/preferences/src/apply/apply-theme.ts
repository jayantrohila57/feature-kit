import type { ThemePreference } from "../schema/schema-app-preferences"

import { THEME_STORAGE_KEY } from "../cookie/cookie-prefs-constants"

/**
 * Sync next-themes localStorage only.
 * DOM `dark` class is owned by SSR + PreferenceBootstrapScript + next-themes —
 * mutating it here during persist/hydration causes cross-app FOUC.
 */
export function applyThemePreference(theme: ThemePreference | undefined) {
  if (typeof document === "undefined" || !theme) return

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Private browsing / storage disabled.
  }
}
