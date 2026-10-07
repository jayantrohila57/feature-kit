/** Resolve Zod / server error text; `translateError` maps i18n keys to locale strings. */
export function resolveFieldErrorMessage(
  message: string | undefined,
  translateError?: ((message: string) => string) | undefined,
): string | undefined {
  if (!message) {
    return undefined
  }

  return translateError?.(message) ?? message
}
