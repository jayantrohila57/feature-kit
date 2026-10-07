"use client"

import { useMemo } from "react"
import { CommonUploaderButton, type UploaderConfig } from "uploader"

import { demoAccountUploaderColumns } from "./demo-uploader-columns"

export function UploaderBasicExample() {
	const config = useMemo<UploaderConfig>(
		() => ({
			entity: "demo-account",
			entityLabel: "accounts",
			title: "Import accounts (demo)",
			description: "Upload a CSV or Excel file using the sample template. Rows are parsed in the browser; no API is called.",
			fileFormat: "standard",
			templateFileName: "demo-account-import-template",
			acceptedFileTypes: ".xlsx,.csv",
			columns: demoAccountUploaderColumns,
			defaultMode: "create",
			transport: "records",
			historyHref: "/examples",
		}),
		[],
	)

	return (
		<CommonUploaderButton
			config={config}
			triggerLabel="Import accounts"
			redirectOnSuccess={false}
			onUpload={async ({ records }) => {
				await new Promise((resolve) => {
					window.setTimeout(resolve, 400)
				})
				return {
					success: true,
					message: `Imported ${records.length} account row(s) (demo only).`,
				}
			}}
		/>
	)
}
