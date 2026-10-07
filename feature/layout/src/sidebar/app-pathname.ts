/** Strip locale prefix so table URL sync compares stable path segments. */
export function normalizeAppPathname(path: string): string {
  let pathname = path.split("?")[0]?.split("#")[0] ?? path
  if (!pathname.startsWith("/")) pathname = `/${pathname}`

  pathname = pathname.replace(/^\/[a-z]{2}(?:-[A-Za-z]{2})?(?=\/|$)/, "") || "/"

  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1)
  }

  return pathname || "/"
}

export function getDisplayedAppPathname(hookPathname: string): string {
  if (typeof window === "undefined") return hookPathname
  return normalizeAppPathname(window.location.pathname)
}

export function hasInFlightAppPathname(hookPathname: string): boolean {
  if (typeof window === "undefined") return false
  return getDisplayedAppPathname(hookPathname) !== normalizeAppPathname(hookPathname)
}

export function buildDisplayedAppHref(hookPathname: string, query: string): string | null {
  if (hasInFlightAppPathname(hookPathname)) return null
  const displayedPath = getDisplayedAppPathname(hookPathname)
  return query ? `${displayedPath}?${query}` : displayedPath
}
