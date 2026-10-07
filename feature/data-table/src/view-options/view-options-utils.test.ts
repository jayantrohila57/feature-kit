import { describe, expect, it } from "vitest"

import {
  buildColumnOrder,
  buildColumnPinning,
  createDefaultViewOptionsDraft,
  createViewOptionsDraft,
  draftToVisibilityState,
  extractHideableOrderFromTable,
  extractPinnedHideableIds,
  filterOptionalColumns,
  getColumnIdsFromDefs,
  getInitialPinnedLeftFromDefs,
  humanizeColumnId,
  mergeColumnOrder,
  orderOptionalColumns,
  resolveColumnLabel,
} from "./view-options-utils"

describe("view-options-utils", () => {
  it("humanizes camelCase and snake_case ids", () => {
    expect(humanizeColumnId("userEmail")).toBe("User Email")
    expect(humanizeColumnId("user_email")).toBe("User Email")
    expect(humanizeColumnId("email")).toBe("Email")
  })

  it("filters optional columns by label", () => {
    const columns = [
      { id: "email", label: "Email", canHide: true },
      { id: "username", label: "Username", canHide: true },
    ]
    expect(filterOptionalColumns(columns, "mail")).toEqual([columns[0]])
    expect(filterOptionalColumns(columns, "  ")).toEqual(columns)
  })

  it("extracts pinned hideable ids without appending unpinned columns", () => {
    expect(extractPinnedHideableIds(["select", "email"], ["email", "username", "active"])).toEqual(["email"])
  })

  it("reconstructs hideable order from physical column order", () => {
    expect(
      extractHideableOrderFromTable(
        ["select", "email", "username", "active", "actions"],
        ["email", "username", "active"],
        ["email"],
      ),
    ).toEqual(["email", "username", "active"])
  })

  it("creates draft from table state without marking every column pinned", () => {
    const table = {
      getAllLeafColumns: () => [
        { id: "select", getCanHide: () => false, getIsVisible: () => true },
        { id: "email", getCanHide: () => true, getIsVisible: () => true },
        { id: "username", getCanHide: () => true, getIsVisible: () => false },
        { id: "actions", getCanHide: () => false, getIsVisible: () => true },
      ],
      getState: () => ({
        columnOrder: ["select", "email", "username", "actions"],
        columnPinning: { left: ["select", "email"] },
      }),
    } as never

    expect(createViewOptionsDraft(table)).toEqual({
      visibility: { email: true, username: false },
      order: ["email", "username"],
      pinnedLeft: ["email"],
    })
  })

  it("builds default draft and visibility state", () => {
    const draft = createDefaultViewOptionsDraft(["email", "username"])
    expect(draft).toEqual({
      visibility: { email: true, username: true },
      order: ["email", "username"],
      pinnedLeft: [],
    })
    expect(draftToVisibilityState(draft)).toEqual({
      email: true,
      username: true,
    })
  })

  it("extracts column ids from defs", () => {
    expect(
      getColumnIdsFromDefs([{ id: "select" }, { accessorKey: "email" }, { id: "actions", accessorKey: "ignored" }]),
    ).toEqual(["select", "email", "actions"])
  })

  it("collects default pinned columns from column meta", () => {
    expect(
      getInitialPinnedLeftFromDefs([
        { id: "select" },
        { id: "bankName", meta: { pinnedByDefault: true } },
        { accessorKey: "branchName", meta: { pinnedByDefault: true } },
        { id: "actions" },
      ]),
    ).toEqual(["bankName", "branchName"])
  })

  it("merges stored order with new columns", () => {
    expect(mergeColumnOrder(["email", "username", "active"], ["username", "email"])).toEqual([
      "username",
      "email",
      "active",
    ])
  })

  it("orders optional columns by draft order", () => {
    const columns = [
      { id: "email", label: "Email", canHide: true },
      { id: "username", label: "Username", canHide: true },
    ]
    expect(orderOptionalColumns(columns, ["username", "email"])).toEqual([columns[1], columns[0]])
  })

  it("builds column order with fixed and pinned columns", () => {
    expect(
      buildColumnOrder(["select", "email", "username", "actions"], {
        order: ["username", "email"],
        pinnedLeft: ["email"],
      }),
    ).toEqual(["select", "email", "username", "actions"])
  })

  it("builds column pinning with fixed columns", () => {
    expect(
      buildColumnPinning(["select", "email", "actions"], {
        pinnedLeft: ["email"],
      }),
    ).toEqual({
      left: ["select", "email"],
      right: ["actions"],
    })
  })

  it("resolves labelKey only when translation exists", () => {
    const column = {
      id: "bankAccountCode",
      columnDef: { meta: { labelKey: "viewBankStatement.column.account" } },
    } as never

    const t = Object.assign((key: string) => `translated:${key}`, {
      has: (key: string) => key === "viewBankStatement.column.account",
    })

    expect(resolveColumnLabel(column, t)).toBe("translated:viewBankStatement.column.account")

    const tMissing = Object.assign((key: string) => `translated:${key}`, {
      has: () => false,
    })
    expect(resolveColumnLabel(column, tMissing)).toBe("Bank Account Code")
  })
})
