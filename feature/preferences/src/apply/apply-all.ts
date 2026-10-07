import type { AppPreferences } from "../schema/schema-app-preferences"

import { applyLocalePreference } from "./apply-locale"
import { applyThemePreference } from "./apply-theme"

/** Run all paint-critical preference appliers (browser). */
export function applyAppPreferences(prefs: AppPreferences) {
  applyThemePreference(prefs.theme)
  applyLocalePreference(prefs.locale)
}
