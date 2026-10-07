import type { AppPreferences } from "preferences"

import { createFormatter } from "next-intl"

import { resolveEffectivePreferences } from "./effective-preferences"
import { createSemanticFormats } from "./presets"

export function getGlobalFormatter(prefs: AppPreferences, locale: string) {
  const effective = resolveEffectivePreferences(prefs, locale)
  return createFormatter({
    locale,
    formats: createSemanticFormats(prefs, locale),
    timeZone: effective.timezone ?? "UTC",
  })
}
