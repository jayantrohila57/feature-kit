"use client"

import type {
  UploaderConfig,
  UploaderParseResult,
  UploaderRecord,
  UploaderSubmitResult,
  UploadMode,
} from "../uploader-types"

import { SearchableSelect } from "form"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, Download, FileSpreadsheet, Files, FileText, History, Upload, XIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { type DragEvent, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/packages/ui/components/alert"
import { Button } from "@/packages/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/packages/ui/components/dialog"
import { Input } from "@/packages/ui/components/input"
import { Label } from "@/packages/ui/components/label"
import Spinner from "@/packages/ui/components/spinner"
import { cn } from "@/packages/ui/lib/utils"

import { parseSpreadsheetFile } from "../parse/parse-spreadsheet-file"
import { validateUploaderRecords } from "../parse/parse-validate-records"
import { downloadUploaderTemplate } from "../template/template-download-template"
import { formatFileSize, isAcceptedUploadFileName, isSpreadsheetFileName } from "../utils/utils-format-file-size"

const MAX_INLINE_ISSUES = 5

/** Fixed height for dropzone and selected-file states to prevent layout shift. */
const FILE_PICKER_SLOT_CLASS = "h-40 w-full"

/** Keep spinner/toast visible at least this long so instant uploads still feel intentional. */
const MIN_UPLOAD_FEEDBACK_MS = 300

async function waitAtLeast(startedAtMs: number, minimumMs: number): Promise<void> {
  const remainingMs = minimumMs - (performance.now() - startedAtMs)
  if (remainingMs > 0) {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, remainingMs)
    })
  }
}

type CommonUploaderButtonProps = {
  config: UploaderConfig
  triggerLabel: string
  triggerVariant?: "default" | "outline"
  redirectOnSuccess?: boolean
  onUploadSuccess?: () => void
  onUpload?: (params: { mode: UploadMode; records: UploaderRecord[] }) => Promise<UploaderSubmitResult>
  onUploadFile?: (params: { file: File; formatCode: string }) => Promise<UploaderSubmitResult>
  onDownloadTemplate?: (formatCode: string) => Promise<void>
  loadFormatCodes?: () => Promise<string[]>
  /**
   * Format options with their own labels, for callers that can name a format better than its code.
   * Takes precedence over `loadFormatCodes`; without it the code is both value and label, which is
   * what every existing caller renders today.
   */
  loadFormatOptions?: () => Promise<{ value: string; label: string }[]>
  /** When supplied, an empty dynamic format list stays unselected instead of using the fallback. */
  emptyFormatLabel?: string
}

function CommonUploaderButtonInner({
  config,
  triggerLabel,
  triggerVariant = "outline",
  redirectOnSuccess = true,
  onUploadSuccess,
  onUpload,
  onUploadFile,
  onDownloadTemplate,
  loadFormatCodes,
  loadFormatOptions,
  emptyFormatLabel,
}: CommonUploaderButtonProps) {
  const t = useTranslations()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [parseResult, setParseResult] = useState<UploaderParseResult | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)
  const [submitFeedback, setSubmitFeedback] = useState<UploaderSubmitResult | null>(null)
  const [formatOptions, setFormatOptions] = useState<{ value: string; label: string }[]>(
    emptyFormatLabel ? [] : [{ value: config.fileFormat, label: config.fileFormat }],
  )
  const [selectedFormatCode, setSelectedFormatCode] = useState(emptyFormatLabel ? "" : config.fileFormat)
  const [isLoadingFormatCodes, setIsLoadingFormatCodes] = useState(false)

  const transport = config.transport ?? "records"
  const isFileTransport = transport === "file"
  const uploadMode = config.defaultMode ?? "create"
  const historyHref = config.historyHref ?? "/file-processing/import-history"
  const buildSuccessRedirectHref = config.buildSuccessRedirectHref
  const entityLabel = config.entityLabel ?? config.entity

  const parseIssues = parseResult?.errors ?? []
  const validRecordCount = parseResult?.records.length ?? 0
  const isFormatSelectionLocked = isLoadingFormatCodes || isUploading
  const loadFormats = loadFormatOptions ?? loadFormatCodes
  const canUpload = isFileTransport
    ? Boolean(
        selectedFile &&
          selectedFormatCode &&
          !isUploading &&
          !isLoadingFormatCodes &&
          isAcceptedUploadFileName(selectedFile.name, config.acceptedFileTypes),
      )
    : Boolean(parseResult && validRecordCount > 0 && parseIssues.length === 0 && !isUploading && !isParsing)

  /**
   * Reloads whenever the loader's identity changes, not only when the dialog opens: a caller whose
   * format list depends on a choice made INSIDE the dialog passes a new closure as that choice
   * changes, and the list has to follow it.
   */
  useEffect(() => {
    if (!open || !loadFormats) return

    let cancelled = false
    setIsLoadingFormatCodes(true)

    loadFormats()
      .then((loaded) => {
        if (cancelled) return
        const options = loaded.map((entry) => (typeof entry === "string" ? { value: entry, label: entry } : entry))
        const next =
          options.length > 0
            ? options
            : emptyFormatLabel
              ? []
              : [{ value: config.fileFormat, label: config.fileFormat }]
        setFormatOptions(next)
        setSelectedFormatCode(next[0]?.value ?? (emptyFormatLabel ? "" : config.fileFormat))
      })
      .catch((error) => {
        if (cancelled) return
        const message = error instanceof Error ? error.message : t("uploader.templateDownloadFailed")
        toast.error(message)
        setFormatOptions(emptyFormatLabel ? [] : [{ value: config.fileFormat, label: config.fileFormat }])
        setSelectedFormatCode(emptyFormatLabel ? "" : config.fileFormat)
      })
      .finally(() => {
        if (!cancelled) setIsLoadingFormatCodes(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, loadFormats, config.fileFormat, emptyFormatLabel, t])

  const resetState = () => {
    setSelectedFile(null)
    setParseResult(null)
    setIsParsing(false)
    setIsDownloadingTemplate(false)
    setIsUploading(false)
    setIsDragActive(false)
    setSubmitFeedback(null)
    setFormatOptions(emptyFormatLabel ? [] : [{ value: config.fileFormat, label: config.fileFormat }])
    setSelectedFormatCode(emptyFormatLabel ? "" : config.fileFormat)
    setIsLoadingFormatCodes(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      resetState()
    }
  }

  const completeSuccessfulUpload = (
    toastId: string | number,
    message: string,
    redirectContext?: { fileName?: string; formatCode?: string },
  ) => {
    toast.success(message, { id: toastId })
    handleOpenChange(false)
    onUploadSuccess?.()
    if (redirectOnSuccess) {
      const fileName = redirectContext?.fileName?.trim()
      const formatCode = redirectContext?.formatCode?.trim()
      const successHref =
        fileName && buildSuccessRedirectHref
          ? buildSuccessRedirectHref({ fileName, formatCode: formatCode ?? "" })
          : historyHref
      router.push(successHref)
    }
  }

  const handleDownloadTemplate = async () => {
    setIsDownloadingTemplate(true)

    try {
      if (onDownloadTemplate) {
        await onDownloadTemplate(selectedFormatCode)
      } else {
        await downloadUploaderTemplate(config.columns, config.templateFileName)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : t("uploader.templateDownloadFailed")
      toast.error(message)
    } finally {
      setIsDownloadingTemplate(false)
    }
  }

  const handleFileSelection = async (file: File | null) => {
    setSelectedFile(file)
    setSubmitFeedback(null)

    if (!file) {
      setParseResult(null)
      return
    }

    if (isFileTransport) {
      if (!isAcceptedUploadFileName(file.name, config.acceptedFileTypes)) {
        setParseResult({
          records: [],
          errors: [{ row: 1, message: t("uploader.parseFailed") }],
          skippedRowCount: 0,
          headerLabels: [],
        })
        return
      }
      setParseResult({ records: [], errors: [], skippedRowCount: 0, headerLabels: [] })
      return
    }

    setIsParsing(true)
    try {
      const nextParseResult = await parseSpreadsheetFile(file, config.columns)
      const validationErrors = validateUploaderRecords(nextParseResult.records, config.columns, uploadMode)
      const groupedValidationErrors = config.validateParsedRecords?.(nextParseResult.records, uploadMode) ?? []
      setParseResult({
        ...nextParseResult,
        errors: [...nextParseResult.errors, ...validationErrors, ...groupedValidationErrors],
      })
    } catch {
      setParseResult({
        records: [],
        errors: [{ row: 1, message: t("uploader.parseFailed") }],
        skippedRowCount: 0,
        headerLabels: [],
      })
    } finally {
      setIsParsing(false)
    }
  }

  const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setIsDragActive(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setIsDragActive(false)
  }

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setIsDragActive(false)
    const file = event.dataTransfer.files?.[0] ?? null
    void handleFileSelection(file)
  }

  const handleClearFile = () => {
    void handleFileSelection(null)
  }

  const handleUpload = async () => {
    if (isFileTransport) {
      if (!selectedFile || !selectedFormatCode || !onUploadFile) return

      setIsUploading(true)
      setSubmitFeedback(null)
      const startedAtMs = performance.now()
      const toastId = toast.loading(t("uploader.uploading", { count: 1, entity: entityLabel }))

      try {
        const result = await onUploadFile({ file: selectedFile, formatCode: selectedFormatCode })
        await waitAtLeast(startedAtMs, MIN_UPLOAD_FEEDBACK_MS)

        if (result.success) {
          completeSuccessfulUpload(toastId, result.message, {
            fileName: selectedFile.name,
            formatCode: selectedFormatCode,
          })
          return
        }

        toast.dismiss(toastId)
        setSubmitFeedback(result)
      } catch (error) {
        await waitAtLeast(startedAtMs, MIN_UPLOAD_FEEDBACK_MS)
        const message = error instanceof Error ? error.message : t("uploader.uploadFailed")
        toast.dismiss(toastId)
        setSubmitFeedback({ success: false, message })
      } finally {
        setIsUploading(false)
      }
      return
    }

    if (!parseResult || parseResult.records.length === 0 || parseIssues.length > 0 || !onUpload) {
      return
    }

    setIsUploading(true)
    setSubmitFeedback(null)
    const startedAtMs = performance.now()
    const toastId = toast.loading(t("uploader.uploading", { count: parseResult.records.length, entity: entityLabel }))

    try {
      const result = await onUpload({ mode: uploadMode, records: parseResult.records })
      await waitAtLeast(startedAtMs, MIN_UPLOAD_FEEDBACK_MS)

      if (result.success) {
        const uploadedFileName = selectedFile?.name?.trim()
        completeSuccessfulUpload(toastId, result.message, uploadedFileName ? { fileName: uploadedFileName } : undefined)
        return
      }

      toast.dismiss(toastId)
      setSubmitFeedback(result)
    } catch (error) {
      await waitAtLeast(startedAtMs, MIN_UPLOAD_FEEDBACK_MS)
      const message = error instanceof Error ? error.message : t("uploader.uploadFailed")
      toast.dismiss(toastId)
      setSubmitFeedback({ success: false, message })
    } finally {
      setIsUploading(false)
    }
  }

  const fileStatusLabel = isFileTransport
    ? selectedFile
      ? null
      : null
    : isParsing
      ? ` · ${t("uploader.parsingFile")}`
      : validRecordCount > 0
        ? ` · ${t("uploader.validRowsReady", { count: validRecordCount })}`
        : null

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={triggerVariant}
          size="lg">
          <Upload
            aria-hidden
            data-icon="inline-start"
          />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent
        variant="form"
        showCloseButton={false}
        onInteractOutside={(event) => {
          event.preventDefault()
        }}>
        <DialogHeader className="shrink-0 px-1.5 pt-1.5">
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4 rounded-lg border bg-background p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-xs/relaxed">
              <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">{t("uploader.templateHint")}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => {
                  void handleDownloadTemplate()
                }}
                disabled={isDownloadingTemplate || isLoadingFormatCodes || !selectedFormatCode}>
                {isDownloadingTemplate ? <Spinner className="size-3.5" /> : <Download data-icon="inline-start" />}
                {t("uploader.downloadSample")}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-4 rounded-lg border bg-background p-3">
          <div className="grid grid-cols-2 gap-2">
            <Label
              htmlFor={`${config.entity}-file-format`}
              className="flex gap-2">
              <Files className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="flex flex-col gap-1">
                <span className="text-xs/relaxed">{t("uploader.selectTemplate")}</span>
              </div>
            </Label>
            <SearchableSelect
              id={`${config.entity}-file-format`}
              value={selectedFormatCode}
              disabled={!loadFormats || isFormatSelectionLocked}
              loading={isLoadingFormatCodes}
              onValueChange={setSelectedFormatCode}
              options={formatOptions}
              placeholder={selectedFormatCode || emptyFormatLabel || t("uploader.selectTemplate")}
              searchPlaceholder="Search format codes…"
              emptyMessage="No format codes available."
              noResultsMessage="No matching format codes."
              required
              {...(loadFormats && !emptyFormatLabel && !isLoadingFormatCodes && formatOptions.length === 0
                ? { optionsError: "Failed to load format codes." }
                : {})}
              aria-label={t("uploader.selectTemplate")}
            />
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            accept={config.acceptedFileTypes ?? ".xlsx,.csv"}
            className="sr-only"
            disabled={isFormatSelectionLocked || isParsing}
            onChange={(event) => {
              void handleFileSelection(event.target.files?.[0] ?? null)
            }}
          />

          {selectedFile ? (
            <div className={cn("flex flex-col overflow-hidden rounded-lg border bg-muted/20", FILE_PICKER_SLOT_CLASS)}>
              <div className="flex min-h-0 flex-1 items-start gap-3 p-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-background">
                  {isParsing ? (
                    <Spinner className="size-4" />
                  ) : isSpreadsheetFileName(selectedFile.name) ? (
                    <FileSpreadsheet
                      aria-hidden
                      className="size-4 text-muted-foreground"
                    />
                  ) : (
                    <FileText
                      aria-hidden
                      className="size-4 text-muted-foreground"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-sm">{selectedFile.name}</p>
                  <p className="text-muted-foreground text-xs/relaxed">
                    {formatFileSize(selectedFile.size)}
                    {fileStatusLabel}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  aria-label={t("uploader.removeFile")}
                  disabled={isUploading || isLoadingFormatCodes}
                  onClick={handleClearFile}>
                  <XIcon className="size-4" />
                </Button>
              </div>

              <div className="flex h-7 shrink-0 items-center justify-center pb-1.5">
                {!isParsing && !isUploading && !isLoadingFormatCodes ? (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto px-0 text-xs"
                    onClick={() => {
                      fileInputRef.current?.click()
                    }}>
                    {t("uploader.replaceFile")}
                  </Button>
                ) : (
                  <span
                    className="invisible text-xs"
                    aria-hidden>
                    {t("uploader.replaceFile")}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                fileInputRef.current?.click()
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 text-center transition-colors",
                FILE_PICKER_SLOT_CLASS,
                isFormatSelectionLocked ? "cursor-not-allowed opacity-60" : null,
                isDragActive
                  ? "border-primary/50 bg-primary/5"
                  : "border-border/80 bg-muted/10 hover:border-border hover:bg-muted/20",
              )}
              disabled={isFormatSelectionLocked}
              aria-disabled={isFormatSelectionLocked}>
              <Upload className="size-8 text-muted-foreground" />
              <div className="space-y-1">
                <p className="font-medium text-sm">{t("uploader.dropzoneTitle")}</p>
                <p className="text-muted-foreground text-xs/relaxed">{t("uploader.dropzoneHint")}</p>
              </div>
            </button>
          )}

          {parseIssues.length > 0 ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>{t("uploader.validationIssues")}</AlertTitle>
              <AlertDescription>
                <ul className="mt-1 list-disc space-y-0.5 ps-4">
                  {parseIssues.slice(0, MAX_INLINE_ISSUES).map((issue) => (
                    <li key={`${issue.row}-${issue.column ?? "general"}-${issue.message}`}>
                      {issue.column
                        ? t("uploader.issueWithColumn", {
                            row: issue.row,
                            column: issue.column,
                            message: issue.message,
                          })
                        : t("uploader.issueWithRow", { row: issue.row, message: issue.message })}
                    </li>
                  ))}
                </ul>
                {parseIssues.length > MAX_INLINE_ISSUES ? (
                  <p className="mt-1.5">
                    {t("uploader.validationIssuesTruncated", {
                      count: parseIssues.length - MAX_INLINE_ISSUES,
                    })}
                  </p>
                ) : null}
              </AlertDescription>
            </Alert>
          ) : null}

          {submitFeedback && !submitFeedback.success ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>{submitFeedback.message || t("uploader.uploadFailed")}</AlertTitle>
              {submitFeedback.details && submitFeedback.details !== submitFeedback.message ? (
                <AlertDescription>
                  <p>{submitFeedback.details}</p>
                </AlertDescription>
              ) : null}
            </Alert>
          ) : null}

          <div className="flex w-full flex-row justify-between gap-2">
            <div className="flex w-full flex-1 flex-row items-center justify-start gap-2 text-left">
              <Button
                type="button"
                variant="outline"
                size={"lg"}
                asChild>
                <Link href={historyHref}>
                  <History data-icon="inline-start" />
                  {t("uploader.viewHistory")}
                </Link>
              </Button>
            </div>
            <div className="flex w-full flex-1 flex-row items-center justify-end gap-2 text-left">
              <Button
                type="button"
                size={"lg"}
                variant="destructive"
                onClick={() => {
                  handleOpenChange(false)
                }}>
                {t("uploader.cancel")}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  void handleUpload()
                }}
                size={"lg"}
                disabled={!canUpload}
                className={cn(isUploading && "pointer-events-none")}>
                {isUploading ? <Spinner className="size-3.5" /> : <Upload data-icon="inline-start" />}
                {t("uploader.upload", { count: isFileTransport ? 1 : validRecordCount })}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function CommonUploaderButton(props: CommonUploaderButtonProps) {
  return <CommonUploaderButtonInner {...props} />
}
