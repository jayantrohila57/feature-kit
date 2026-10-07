export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  const kilobytes = bytes / 1024
  if (kilobytes < 1024) {
    return `${Math.max(Math.round(kilobytes), 1)} KB`
  }

  const megabytes = kilobytes / 1024
  return `${megabytes.toFixed(1)} MB`
}

export function isSpreadsheetFileName(name: string): boolean {
  const lower = name.toLowerCase()
  return lower.endsWith(".xlsx") || lower.endsWith(".xls") || lower.endsWith(".csv")
}

const DEFAULT_ACCEPTED_FILE_TYPES = [".xlsx", ".xls", ".csv"]

export function parseAcceptedFileTypes(acceptedFileTypes?: string): string[] {
  if (!acceptedFileTypes?.trim()) {
    return DEFAULT_ACCEPTED_FILE_TYPES
  }

  return acceptedFileTypes
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .map((token) => (token.startsWith(".") ? token : `.${token}`))
}

export function isAcceptedUploadFileName(name: string, acceptedFileTypes?: string): boolean {
  const lower = name.toLowerCase()
  return parseAcceptedFileTypes(acceptedFileTypes).some((extension) => lower.endsWith(extension))
}
