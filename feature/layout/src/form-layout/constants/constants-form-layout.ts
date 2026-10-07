/** Full-height form shell for dashboard pages — one surface card with a fixed footer. */
export const FORM_LAYOUT_ROOT_CLASS =
  "rounded-lg border border-surface-card-border bg-surface-card shadow-(--elevation-card) flex h-full min-h-0 w-full flex-col overflow-hidden"

/** Positions the scroll hint and scrollable fields region above the footer. */
export const FORM_LAYOUT_BODY_WRAPPER_CLASS = "relative min-h-0 flex-1"

/** Scrollable fields region. */
export const FORM_LAYOUT_BODY_SCROLL_CLASS = "h-full overflow-y-auto"

/**
 * Scroll body. `FormSection`s stack flush and draw their own dividers and
 * padding; anything else placed directly in the body gets the same inset.
 */
export const FORM_LAYOUT_BODY_CLASS = "flex flex-col gap-0 p-0 [&>*:not(section)]:px-5 [&>*:not(section)]:py-4"

/** Fixed action bar pinned below the scroll body. */
export const FORM_LAYOUT_FOOTER_CLASS =
  "shrink-0 flex flex-wrap items-center justify-end gap-2 border-border border-t bg-surface-band px-5 py-3"

/** Optional left-aligned hint inside the footer (desktop). */
export const FORM_LAYOUT_ACTIONS_HINT_CLASS = "me-auto hidden items-center gap-2 text-muted-foreground text-xs sm:flex"
