import type { AppPreferences } from "preferences"
import type { RegionalProfile } from "../effective-preferences-types"

const regionalDefaults: Record<string, Partial<AppPreferences>> = {
  IN: {
    dateStyle: "medium",
    timeStyle: "short",
    hourCycle: "h12",
    timezone: "Asia/Kolkata",
    currency: "INR",
    firstDayOfWeek: 1,
  },
  US: {
    dateStyle: "medium",
    timeStyle: "short",
    hourCycle: "h12",
    timezone: "America/New_York",
    currency: "USD",
    firstDayOfWeek: 0,
  },
  GB: {
    dateStyle: "medium",
    timeStyle: "short",
    hourCycle: "h23",
    timezone: "Europe/London",
    currency: "GBP",
    firstDayOfWeek: 1,
  },
}

function getRegionDefaults(region: string) {
  return regionalDefaults[region] ?? {}
}

export const regionalProfiles: readonly RegionalProfile[] = [
  {
    region: "IN",
    locale: "en-IN",
    currency: "INR",
    defaultTimeZone: "Asia/Kolkata",
    defaultFormats: getRegionDefaults("IN"),
  },
  {
    region: "IN",
    locale: "hi-IN",
    currency: "INR",
    defaultTimeZone: "Asia/Kolkata",
    defaultFormats: getRegionDefaults("IN"),
  },
  {
    region: "IN",
    locale: "ur-IN",
    currency: "INR",
    defaultTimeZone: "Asia/Kolkata",
    defaultFormats: getRegionDefaults("IN"),
  },
  {
    region: "US",
    locale: "en-US",
    currency: "USD",
    defaultTimeZone: "America/New_York",
    defaultFormats: getRegionDefaults("US"),
  },
  {
    region: "GB",
    locale: "en-GB",
    currency: "GBP",
    defaultTimeZone: "Europe/London",
    defaultFormats: getRegionDefaults("GB"),
  },
]
