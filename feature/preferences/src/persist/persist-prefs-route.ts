import { NextResponse } from "next/server"

import { readAppPreferencesFromCookieHeader } from "../cookie/cookie-prefs-read"
import { mergeAppPreferences, parseAppPreferences } from "../schema/schema-app-preferences"
import { writeAppPreferencesCookies } from "./persist-prefs.server"

/**
 * POST /api/prefs
 * Merges the JSON body into the shared `aiq-prefs` bag (and legacy mirrors).
 */
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 })
  }

  const patch = parseAppPreferences(body)
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: false, message: "No valid preferences" }, { status: 400 })
  }

  const current = readAppPreferencesFromCookieHeader(req.headers.get("cookie"))
  const merged = mergeAppPreferences(current, patch)

  const response = NextResponse.json({ ok: true, prefs: merged })
  writeAppPreferencesCookies(response, merged)
  return response
}
