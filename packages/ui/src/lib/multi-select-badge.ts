const MULTI_SELECT_BADGE_PRIMARY_CLASS = "border-transparent bg-primary text-primary-foreground" as const

/** Primary badges in multiselect combobox triggers — slightly taller than default Badge (h-4.5 → h-5). */
export const MULTI_SELECT_TRIGGER_BADGE_CLASS =
  `h-5 rounded-sm px-1.5 text-[11px] font-normal ${MULTI_SELECT_BADGE_PRIMARY_CLASS}` as const

export const MULTI_SELECT_TRIGGER_BADGE_TRUNCATE_CLASS = `${MULTI_SELECT_TRIGGER_BADGE_CLASS} min-w-0 truncate` as const

export const MULTI_SELECT_TRIGGER_BADGE_COUNT_CLASS = `${MULTI_SELECT_TRIGGER_BADGE_CLASS} shrink-0` as const

/** Badges under multiselect fields (selected value chips). */
export const MULTI_SELECT_VALUE_BADGE_CLASS = `${MULTI_SELECT_TRIGGER_BADGE_CLASS} gap-1` as const
