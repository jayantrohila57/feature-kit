import type { AppPreferences } from "preferences"

export type RegionalProfile = {
  region: string
  locale: string
  currency: string
  defaultTimeZone: string
  defaultFormats?: Partial<AppPreferences>
}
