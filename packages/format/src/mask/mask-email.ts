/** Character shown in place of hidden characters. */
export const MASK_CHAR = "•"

/**
 * Hidden characters are always shown as this many bullets, whatever the real
 * length — a length-preserving mask still discloses the length.
 */
export const MASK_WIDTH = 4

const MASK = MASK_CHAR.repeat(MASK_WIDTH)

/**
 * Masks one label for display: first and last character around a fixed-width
 * mask. Labels of three characters or fewer keep only the first character, so
 * a short local part is never reconstructable.
 */
export function maskLabel(label: string): string {
  const chars = [...label]
  if (chars.length === 0) return ""
  if (chars.length <= 3) return `${chars[0]}${MASK}`
  return `${chars[0]}${MASK}${chars[chars.length - 1]}`
}

/**
 * DPDP-safe display form of an email address.
 *
 * `user@example.com` → `j••••t@a••••n.ai`: first and last character of
 * the local part and of each domain label are kept, the top-level domain is
 * kept whole so the address still reads as an address. Only for DISPLAY —
 * never feed the result back into a lookup.
 *
 * Returns "" for empty input and masks the whole value when it is not an
 * email (no `@`), so a malformed claim never leaks through unmasked.
 */
export function maskEmail(value: string | null | undefined): string {
  const email = value?.trim() ?? ""
  if (!email) return ""

  const at = email.lastIndexOf("@")
  if (at <= 0 || at === email.length - 1) return maskLabel(email)

  const local = email.slice(0, at)
  const labels = email.slice(at + 1).split(".")
  const tld = labels.length > 1 ? labels.pop() : undefined
  const domain = labels.map(maskLabel).join(".")

  return `${maskLabel(local)}@${domain}${tld ? `.${tld}` : ""}`
}
