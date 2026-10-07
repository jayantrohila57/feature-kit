import type { PrefsLocale } from "../cookie/cookie-prefs-constants"

import { PREFS_RTL_LOCALES } from "../cookie/cookie-prefs-constants"

/** Apply locale to <html lang/dir> before paint (browser only). */
export function applyLocalePreference(locale: PrefsLocale | undefined) {
  if (typeof document === "undefined" || !locale) return

  document.documentElement.lang = locale
  document.documentElement.dir = PREFS_RTL_LOCALES.includes(locale) ? "rtl" : "ltr"
}
