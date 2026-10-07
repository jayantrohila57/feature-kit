/** Attribute on header cells for DOM width measurement of sticky offsets. */
export const DATA_TABLE_COLUMN_ID_ATTR = "data-table-column-id"

export function measureLeftStickyOffsetsFromDom(
  tableElement: HTMLTableElement,
  leftStickyColumnIds: readonly string[],
): Map<string, number> {
  const offsets = new Map<string, number>()
  let current = 0

  for (const id of leftStickyColumnIds) {
    offsets.set(id, current)
    const cell = tableElement.querySelector(`thead tr:first-child [${DATA_TABLE_COLUMN_ID_ATTR}="${CSS.escape(id)}"]`)
    if (cell instanceof HTMLElement) {
      current += Math.round(cell.getBoundingClientRect().width)
    }
  }

  return offsets
}
