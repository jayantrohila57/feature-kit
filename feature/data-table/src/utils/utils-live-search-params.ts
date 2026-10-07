import { getShallowSearchParamsSnapshot } from "./utils-shallow-search-params"

/**
 * Resolve the live listing query string from App Router + document URL.
 *
 * Shallow `history.replaceState` updates the document first; App Router
 * `useSearchParams()` can lag (or lead during in-flight navigations). Merge
 * both sources and let the document win on key conflicts.
 */
export function resolveLiveQueryString(
  serverSearchParams: URLSearchParams,
  liveSearch: string = getShallowSearchParamsSnapshot(),
): string {
  const fromWindow = liveSearch.replace(/^\?/, "")
  if (!fromWindow) {
    return serverSearchParams.toString()
  }

  const merged = new URLSearchParams(serverSearchParams.toString())
  const windowParams = new URLSearchParams(fromWindow)

  for (const key of new Set(windowParams.keys())) {
    merged.delete(key)
    for (const value of windowParams.getAll(key)) {
      merged.append(key, value)
    }
  }

  return merged.toString()
}

/** Build URLSearchParams for client listings (shallow writes + App Router fallback). */
export function createLiveSearchParams(serverSearchParams: URLSearchParams, liveSearch?: string): URLSearchParams {
  return new URLSearchParams(resolveLiveQueryString(serverSearchParams, liveSearch))
}

/** Copy every query entry from `source` into `target` (repeated keys preserved). */
export function mergeSearchParams(target: URLSearchParams, source: URLSearchParams): void {
  for (const key of new Set(source.keys())) {
    for (const value of source.getAll(key)) {
      target.append(key, value)
    }
  }
}
