import type { Formats } from "next-intl"
import type { AppPreferences } from "preferences"

import { defaultLocale, resolveEffectivePreferences } from "./effective-preferences"

export function createSemanticFormats(prefs: AppPreferences, locale: string = defaultLocale): Formats {
  const effective = resolveEffectivePreferences(prefs, locale)
  const customDateStyle = effective.dateStyle
  const customTimeStyle = effective.timeStyle
  const customHourCycle = effective.hourCycle

  return {
    dateTime: {
      short: {
        dateStyle: customDateStyle ?? "short",
        timeStyle: customTimeStyle ?? "short",
        ...(customHourCycle ? { hourCycle: customHourCycle } : {}),
      },
      medium: {
        dateStyle: customDateStyle ?? "medium",
        timeStyle: customTimeStyle ?? "medium",
        ...(customHourCycle ? { hourCycle: customHourCycle } : {}),
      },
      long: {
        dateStyle: customDateStyle ?? "long",
        timeStyle: customTimeStyle ?? "long",
        ...(customHourCycle ? { hourCycle: customHourCycle } : {}),
      },
      compact: { month: "numeric", day: "numeric", year: "2-digit" },
      table: {
        dateStyle: customDateStyle ?? "medium",
        timeStyle: customTimeStyle ?? "short",
        ...(customHourCycle ? { hourCycle: customHourCycle } : {}),
      },
      dateOnly: {
        dateStyle: customDateStyle ?? "medium",
      },
      audit: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
        ...(customHourCycle && { hourCycle: customHourCycle }),
      },
      tooltip: { dateStyle: customDateStyle ?? "full", timeStyle: customTimeStyle ?? "long" },
      relative: {
        /* Relative time is generally handled by format.relativeTime */
      },
      calendar: {
        /* Depending on how next-intl supports calendar strings */
      },
      shortDateTime: {
        dateStyle: customDateStyle ?? "short",
        timeStyle: customTimeStyle ?? "short",
        ...(customHourCycle ? { hourCycle: customHourCycle } : {}),
      },
      longDateTime: {
        dateStyle: customDateStyle ?? "long",
        timeStyle: customTimeStyle ?? "long",
        ...(customHourCycle ? { hourCycle: customHourCycle } : {}),
      },
      time12: { hour: "numeric", minute: "2-digit", hour12: true },
      time24: { hour: "2-digit", minute: "2-digit", hour12: false },
      timeWithSeconds: {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        ...(customHourCycle && { hourCycle: customHourCycle }),
      },
      filename: {
        /* Filename dates usually need custom non-intl logic, but we can set up ISO components */
      },
      inputDate: { year: "numeric", month: "2-digit", day: "2-digit" },
      inputDateTime: { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" },
      month: { month: "long" },
      monthYear: { month: "long", year: "numeric" },
      weekday: { weekday: "long" },
      year: { year: "numeric" },
    },
    number: {
      decimal: { minimumFractionDigits: 0, maximumFractionDigits: 2 },
      table: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
      percentage: { style: "percent", minimumFractionDigits: 1 },
      currency: {
        style: "currency",
        currency: effective.currency ?? "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
      ordinal: {
        /* Requires plural categories usually */
      },
    },
    list: {
      standard: { type: "conjunction" },
    },
  }
}
