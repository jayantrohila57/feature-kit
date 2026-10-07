/** Mirrors how `setSearch` writes `q`, so a draft can be compared against the URL value. */
export function toUrlSearchValue(value: string) {
  return value.trim() === "" ? "" : value
}
