import { applyAppPreferences } from "../apply/apply-all"
import { readAppPreferencesFromDocumentCookie } from "../cookie/cookie-prefs-read"
import { writeAppPreferencesToDocumentCookie } from "../cookie/cookie-prefs-write"
import { type AppPreferences, mergeAppPreferences, preferencesEqual } from "../schema/schema-app-preferences"

function resolveApiPrefix(basePath = ""): string {
  if (basePath && basePath !== "/") {
    return basePath.replace(/\/$/, "")
  }

  if (typeof window === "undefined") return ""

  const segments = window.location.pathname.split("/").filter(Boolean)
  const first = segments[0]
  // Locale-looking first segment (xx-XX) → no app basePath prefix.
  if (first && !/^[a-z]{2}-[A-Z]{2}$/.test(first) && first !== "api") {
    return `/${first}`
  }

  return ""
}

/** Sync merge + cookie write + paint apply + localStorage sync. Returns merged bag. */
export function persistAppPreferences(patch: AppPreferences): AppPreferences {
  if (typeof document === "undefined") return patch

  const merged = writeAppPreferencesToDocumentCookie(patch)
  applyAppPreferences(merged)

  try {
    localStorage.setItem("app-preferences", JSON.stringify(merged))
  } catch {
    // Ignore quota errors
  }

  return merged
}

/** Sync cookie first, then optional POST /api/prefs for SSR Set-Cookie. */
export async function persistAppPreferencesOnServer(patch: AppPreferences, basePath = "") {
  if (typeof window === "undefined") return

  const before = readAppPreferencesFromDocumentCookie()
  const alreadyMatched = preferencesEqual(mergeAppPreferences(before, patch), before)

  persistAppPreferences(patch)
  if (alreadyMatched) return

  const prefix = resolveApiPrefix(basePath)

  try {
    const response = await fetch(`${prefix}/api/prefs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
      credentials: "same-origin",
    })
    if (!response.ok) return
  } catch {
    // Client cookie remains the fallback when the route is unavailable.
  }
}
