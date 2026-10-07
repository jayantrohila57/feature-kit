export function ensureFileExtension(filename: string, extension: string): string {
  const normalizedExtension = extension.startsWith(".") ? extension : `.${extension}`
  const lowerFilename = filename.toLowerCase()
  const lowerExtension = normalizedExtension.toLowerCase()

  if (lowerFilename.endsWith(lowerExtension)) {
    return filename
  }

  return `${filename}${normalizedExtension}`
}

export function downloadBlob(blob: Blob, filename: string): void {
  if (typeof document === "undefined") {
    throw new Error("downloadBlob can only run in a browser environment")
  }

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.style.display = "none"
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
