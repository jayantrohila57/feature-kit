/** Dispatched after `shallowReplaceSearchParams` so React can re-read `window.location.search`. */
export const SHALLOW_SEARCH_PARAMS_EVENT = "feature-kit:shallow-search-params"

export function subscribeShallowSearchParams(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {}
  }

  const handler = () => {
    onStoreChange()
  }

  window.addEventListener(SHALLOW_SEARCH_PARAMS_EVENT, handler)
  window.addEventListener("popstate", handler)

  return () => {
    window.removeEventListener(SHALLOW_SEARCH_PARAMS_EVENT, handler)
    window.removeEventListener("popstate", handler)
  }
}

export function getShallowSearchParamsSnapshot(): string {
  if (typeof window === "undefined") {
    return ""
  }

  return window.location.search
}

/**
 * Replace the current page query string without a Next.js navigation.
 * Always writes to `window.location` (the visible document), not the hook pathname.
 * Do not block on `usePathname()` lag — that prevented filter clears after client redirects.
 */
export function shallowReplaceSearchParams(_pathname: string, mutate: (params: URLSearchParams) => void): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const current = new URLSearchParams(window.location.search)
  const previousQuery = current.toString()
  mutate(current)

  const query = current.toString()
  if (query === previousQuery) {
    return false
  }

  const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname
  window.history.replaceState(window.history.state, "", `${nextUrl}${window.location.hash}`)
  window.dispatchEvent(new Event(SHALLOW_SEARCH_PARAMS_EVENT))
  return true
}
