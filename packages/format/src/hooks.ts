import { useFormatter } from "next-intl"

/**
 * Extended formatters that wrap next-intl to provide typed semantic formats
 * and extra domain formatters (like FileSize, Phone).
 */
export function useFormat() {
  const formatter = useFormatter()

  return {
    ...formatter,
    // Add custom wrapper functions here if needed to ensure strictly typed formats
    // e.g. file size, phone number, address.
    fileSize: (bytes: number) => {
      // Stub implementation. Can use next-intl messages or standard math.
      const mb = bytes / (1024 * 1024)
      return `${formatter.number(mb, { maximumFractionDigits: 2 })} MB`
    },
    phone: (number: string) => {
      // Stub implementation
      return number
    },
  }
}
