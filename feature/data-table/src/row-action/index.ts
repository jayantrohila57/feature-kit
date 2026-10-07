/**
 * Row action compound components for data tables.
 *
 * Heavy module-specific actions should use `next/dynamic` with a matching
 * `*-skeleton.tsx` fallback (see `dynamic-import-skeletons.mdc`).
 *
 * @example
 * ```tsx
 * ...commonColumns.actionsColumn<User>({
 *   actions: [UserRowViewAction, UserRowEditAction, UserRowDeleteAction],
 * })
 * ```
 */

export type { RowActionDeleteProps, RowActionEditProps, RowActionViewProps } from "./common"
export type { RowActionComponent, RowActionComponentProps } from "./row-action-types"
export type { RowActionsMenuProps } from "./row-actions-menu"

export { RowActionDelete, RowActionEdit, RowActionView } from "./common"
export { RowActionsMenu } from "./row-actions-menu"
