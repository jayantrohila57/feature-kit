export type UploadMode = "create" | "update"

export type UploaderTransport = "records" | "file"

export type UploaderRecord = Record<string, string>

export type UploaderColumn = {
  key: string
  header: string
  requiredIn: UploadMode[]
  description?: string
  sample?: string
}

export type UploaderModeOption = {
  value: UploadMode
  label: string
  description: string
}

export type UploaderConfig = {
  /** Stable entity code (form ids, API filters). */
  entity: string
  /** Human-readable label for toast copy; falls back to `entity`. */
  entityLabel?: string
  title: string
  description: string
  fileFormat: string
  templateFileName: string
  acceptedFileTypes?: string
  /** Required for records transport; unused for file transport. */
  columns: UploaderColumn[]
  /** Optional cross-row validation after flat column checks (e.g. grouping rows into one record). */
  validateParsedRecords?: (records: UploaderRecord[], mode: UploadMode) => UploaderParseError[]
  historyHref?: string
  /** Post-upload redirect when filename (and optional format) should narrow Import History. */
  buildSuccessRedirectHref?: (context: { fileName: string; formatCode: string }) => string
  defaultMode?: UploadMode
  /** Default `records` (parse + validate). `file` uploads the raw spreadsheet. */
  transport?: UploaderTransport
}

export type UploaderParseError = {
  row: number
  column?: string
  message: string
}

export type UploaderParseResult = {
  records: UploaderRecord[]
  errors: UploaderParseError[]
  skippedRowCount: number
  headerLabels: string[]
}

export type UploaderSubmitResult = {
  success: boolean
  message: string
  details?: string
}
