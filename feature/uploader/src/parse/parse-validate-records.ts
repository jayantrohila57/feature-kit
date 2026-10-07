import type { UploaderColumn, UploaderParseError, UploaderRecord, UploadMode } from "../uploader-types"

export function validateUploaderRecords(
  records: UploaderRecord[],
  columns: UploaderColumn[],
  mode: UploadMode,
): UploaderParseError[] {
  const errors: UploaderParseError[] = []

  for (const [index, record] of records.entries()) {
    for (const column of columns) {
      if (!column.requiredIn.includes(mode)) {
        continue
      }

      const value = record[column.key]?.trim()
      if (value) {
        continue
      }

      errors.push({
        row: index + 2,
        column: column.header,
        message: `"${column.header}" is required for ${mode} uploads.`,
      })
    }
  }

  return errors
}
