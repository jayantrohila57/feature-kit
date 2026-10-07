/**
 * URL keys cleared by the shared applied-filters control.
 *
 * @deprecated Tables now derive their clearable keys from resolved filter definitions
 * (`collectClearableFilterKeys` in `../filter`). This hard-coded list remains as a fallback
 * union so route-level redirect filters that no column declares are still cleared.
 */
export const DATA_TABLE_CLEAR_FILTER_URL_KEYS = [
  "status",
  "visibility",
  "displayType",
  "color",
  "contentType",
  "isFeatured",
  "deleted",
  "categorySlug",
  "subcategorySlug",
  "stockStatus",
  "hasReserved",
  "hasIncoming",
  "carrier",
  "paymentStatus",
  "provider",
  "role",
  "banned",
  "emailVerified",
  "pageFilter",
  "section",
  "isActive",
  "q",
  "sortBy",
  "sortDir",
  "approvalStatus",
  "approval",
  "active",
  "enabled",
  "activeStatus",
  "applicationCode",
  "app",
  "code",
  "bankType",
  "countryCode",
  // Import-history and upload redirect filters.
  "processName",
  "hostType",
  "hostCode",
  "entityType",
  "fileName",
  "entity",
  "callbackUrl",
  // Listing filters also used by route-level tabs/header controls.
  "bank",
  "bankMode",
  "channel",
  "reasonType",
  "matchType",
  "sourceType",
  // Host Reconciliation's column menus: cleared with the rest, like matchType above.
  "reconStatus",
  "outcome",
] as const
