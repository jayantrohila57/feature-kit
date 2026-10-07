export { applyAppPreferences } from "./apply/apply-all"
export { applyLocalePreference } from "./apply/apply-locale"
export { applyThemePreference } from "./apply/apply-theme"
export { PreferenceBootstrapScript } from "./bootstrap/bootstrap-preference-script"
export {
  LEGACY_LOCALE_COOKIE_NAME,
  LEGACY_THEME_COOKIE_NAME,
  PREFS_COOKIE_NAME,
  PREFS_LOCALES,
  PREFS_RTL_LOCALES,
  type PrefsLocale,
  sharedPrefsCookie,
  THEME_STORAGE_KEY,
} from "./cookie/cookie-prefs-constants"
export {
  readAppPreferencesFromCookieHeader,
  readAppPreferencesFromDocumentCookie,
} from "./cookie/cookie-prefs-read"
export { writeAppPreferencesToDocumentCookie } from "./cookie/cookie-prefs-write"
export {
  persistAppPreferences,
  persistAppPreferencesOnServer,
} from "./persist/persist-prefs.client"
export {
  type AppPreferences,
  isPrefsLocale,
  isThemePreference,
  mergeAppPreferences,
  parseAppPreferences,
  preferencesEqual,
  serializeAppPreferences,
  type ThemePreference,
} from "./schema/schema-app-preferences"
