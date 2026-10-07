export function areReadonlyStringArraysEqual(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((key, index) => key === b[index])
}

export function nextPinnedFilterKeysIfChanged(current: readonly string[], keys: readonly string[]): readonly string[] {
  if (areReadonlyStringArraysEqual(current, keys)) {
    return current
  }
  return [...keys]
}
