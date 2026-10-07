import type { AppPreferences } from "preferences"
import type { RegionalProfile } from "../effective-preferences-types"

import {
  defaultCurrency,
  defaultDateStyle,
  defaultLocale,
  defaultTimeStyle,
  defaultTimeZone,
  regionalProfiles,
} from "../constants"

export function getRegionalProfileForLocale(locale: string): RegionalProfile {
  return regionalProfiles.find((profile) => profile.locale === locale) ?? (regionalProfiles[0] as RegionalProfile)
}

/**
 * Merge cookie preferences with locale-derived regional defaults, then global i18n fallbacks.
 * Explicit cookie values win; missing fields are filled from the locale profile.
 */
export function resolveEffectivePreferences(prefs: AppPreferences, locale: string = defaultLocale): AppPreferences {
  const profile = getRegionalProfileForLocale(locale)
  const regional = profile.defaultFormats ?? {}

  const resolved: AppPreferences = {
    ...prefs,
    currency: prefs.currency ?? regional.currency ?? profile.currency ?? defaultCurrency,
    timezone: prefs.timezone ?? regional.timezone ?? profile.defaultTimeZone ?? defaultTimeZone,
    dateStyle: prefs.dateStyle ?? regional.dateStyle ?? defaultDateStyle,
    timeStyle: prefs.timeStyle ?? regional.timeStyle ?? defaultTimeStyle,
  }

  const hourCycle = prefs.hourCycle ?? regional.hourCycle
  if (hourCycle) {
    resolved.hourCycle = hourCycle
  }

  const firstDayOfWeek = prefs.firstDayOfWeek ?? regional.firstDayOfWeek
  if (firstDayOfWeek !== undefined) {
    resolved.firstDayOfWeek = firstDayOfWeek
  }

  if (
    !resolved.locale &&
    (locale === "en-IN" || locale === "hi-IN" || locale === "ur-IN" || locale === "en-US" || locale === "en-GB")
  ) {
    resolved.locale = locale
  }

  return resolved
}
