import { describe, expect, it } from "vitest"

import {
  type AppPreferences,
  isCalendar,
  isCurrencyCode,
  isFirstDayOfWeek,
  isNumberingSystem,
  isTimeZone,
  mergeAppPreferences,
  parseAppPreferences,
  preferencesEqual,
} from "./schema-app-preferences"

/**
 * The bag is parsed from a client-written cookie and every field lands in an
 * `Intl` constructor, which throws `RangeError` on an unrecognised option. These
 * tests exist to keep a forged cookie from becoming a render crash.
 */
describe("parseAppPreferences", () => {
  it("returns an empty bag for non-objects", () => {
    expect(parseAppPreferences(null)).toEqual({})
    expect(parseAppPreferences("theme=dark")).toEqual({})
    expect(parseAppPreferences([{ theme: "dark" }])).toEqual({})
  })

  it("keeps a fully valid bag", () => {
    const input: AppPreferences = {
      theme: "dark",
      locale: "en-IN",
      timezone: "Asia/Kolkata",
      currency: "INR",
      numberingSystem: "latn",
      calendar: "gregory",
      firstDayOfWeek: 1,
      dateStyle: "medium",
      timeStyle: "short",
      hourCycle: "h12",
    }
    expect(parseAppPreferences(input)).toEqual(input)
  })

  it("drops every field a forged cookie could poison", () => {
    expect(
      parseAppPreferences({
        theme: "neon",
        locale: "fr-FR",
        timezone: "Mars/Olympus_Mons",
        currency: "RUPEES",
        numberingSystem: "elvish",
        calendar: "stardate",
        firstDayOfWeek: 9,
        dateStyle: "banana",
        timeStyle: "",
        hourCycle: "h25",
      }),
    ).toEqual({})
  })

  it("keeps valid fields alongside invalid ones", () => {
    expect(parseAppPreferences({ theme: "light", timezone: "Not/AZone", currency: "INR", dateStyle: "nope" })).toEqual({
      theme: "light",
      currency: "INR",
    })
  })

  it("normalises currency case", () => {
    expect(parseAppPreferences({ currency: "inr" }).currency).toBe("INR")
  })

  it("rejects a non-integer firstDayOfWeek", () => {
    // In range but fractional — the old `>= 0 && <= 6` check let this through.
    expect(parseAppPreferences({ firstDayOfWeek: 3.5 })).toEqual({})
  })
})

describe("value guards", () => {
  it("accepts real IANA zones and rejects invented ones", () => {
    expect(isTimeZone("Asia/Kolkata")).toBe(true)
    expect(isTimeZone("UTC")).toBe(true)
    expect(isTimeZone("Asia/Kolkatta")).toBe(false)
    expect(isTimeZone("")).toBe(false)
    expect(isTimeZone("A".repeat(200))).toBe(false)
  })

  it("accepts aliases, not just ICU-canonical ids", () => {
    // Regression: validating against Intl.supportedValuesOf("timeZone") rejected
    // these, because that list is canonical-only — ICU canonicalises India to
    // Asia/Calcutta, so the modern Asia/Kolkata was dropped from every cookie.
    expect(isTimeZone("Asia/Calcutta")).toBe(true)
    expect(isTimeZone("Asia/Kolkata")).toBe(true)
    expect(isTimeZone("America/Buenos_Aires")).toBe(true)
  })

  it("caches without growing without bound", () => {
    for (let i = 0; i < 400; i++) isTimeZone(`Bogus/Zone_${i}`)
    expect(isTimeZone("Asia/Kolkata")).toBe(true)
  })

  it("accepts ISO 4217 shapes only", () => {
    expect(isCurrencyCode("INR")).toBe(true)
    expect(isCurrencyCode("usd")).toBe(true)
    expect(isCurrencyCode("IN")).toBe(false)
    expect(isCurrencyCode("INR ")).toBe(false)
    expect(isCurrencyCode("₹")).toBe(false)
  })

  it("validates numbering systems and calendars", () => {
    expect(isNumberingSystem("latn")).toBe(true)
    expect(isNumberingSystem("deva")).toBe(true)
    expect(isNumberingSystem("../../etc")).toBe(false)
    expect(isCalendar("gregory")).toBe(true)
    expect(isCalendar("<script>")).toBe(false)
  })

  it("bounds firstDayOfWeek to whole days", () => {
    expect(isFirstDayOfWeek(0)).toBe(true)
    expect(isFirstDayOfWeek(6)).toBe(true)
    expect(isFirstDayOfWeek(7)).toBe(false)
    expect(isFirstDayOfWeek(-1)).toBe(false)
    expect(isFirstDayOfWeek(3.5)).toBe(false)
    expect(isFirstDayOfWeek("1")).toBe(false)
  })
})

describe("a parsed bag is always safe to format with", () => {
  it("never yields options Intl rejects", () => {
    const hostile = {
      timezone: "Mars/Olympus_Mons",
      calendar: "stardate",
      numberingSystem: "elvish",
      hourCycle: "h25",
      dateStyle: "banana",
      currency: "RUPEES",
    }
    const prefs = parseAppPreferences(hostile)

    expect(() => {
      new Intl.DateTimeFormat("en-IN", {
        ...(prefs.timezone ? { timeZone: prefs.timezone } : {}),
        ...(prefs.calendar ? { calendar: prefs.calendar } : {}),
        ...(prefs.hourCycle ? { hourCycle: prefs.hourCycle } : {}),
        ...(prefs.dateStyle ? { dateStyle: prefs.dateStyle } : {}),
      })
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: prefs.currency ?? "INR",
        ...(prefs.numberingSystem ? { numberingSystem: prefs.numberingSystem } : {}),
      })
    }).not.toThrow()
  })
})

describe("merge and equality are unchanged", () => {
  it("patch overrides base, undefined does not clobber", () => {
    expect(mergeAppPreferences({ theme: "dark", currency: "INR" }, { theme: "light", currency: undefined })).toEqual({
      theme: "light",
      currency: "INR",
    })
  })

  it("compares field by field", () => {
    expect(preferencesEqual({ theme: "dark" }, { theme: "dark" })).toBe(true)
    expect(preferencesEqual({ theme: "dark" }, { theme: "light" })).toBe(false)
  })
})

describe("brand theme preference", () => {
  it("accepts brand as a stored theme", () => {
    expect(parseAppPreferences({ theme: "brand" })).toEqual({ theme: "brand" })
  })
})
