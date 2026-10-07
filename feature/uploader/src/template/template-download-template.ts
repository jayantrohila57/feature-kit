import type { UploaderColumn } from "../uploader-types"

function ensureFileExtension(filename: string, extension: string): string {
  const normalizedExtension = extension.startsWith(".") ? extension : `.${extension}`
  return filename.toLowerCase().endsWith(normalizedExtension.toLowerCase())
    ? filename
    : `${filename}${normalizedExtension}`
}

function downloadBlob(blob: Blob, filename: string): void {
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

export async function downloadUploaderTemplate(columns: UploaderColumn[], filename: string): Promise<void> {
  const XLSX = await import("xlsx")

  const sampleRow = Object.fromEntries(columns.map((column) => [column.header, column.sample ?? ""]))
  const worksheet = XLSX.utils.json_to_sheet([sampleRow], {
    header: columns.map((column) => column.header),
  })
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template")

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" }) as ArrayBuffer
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

  downloadBlob(blob, ensureFileExtension(filename, ".xlsx"))
}
