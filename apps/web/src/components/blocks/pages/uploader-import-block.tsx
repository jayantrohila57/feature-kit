"use client"

import { ContentPageHeader, DashboardShell } from "layout"
import { useMemo } from "react"
import { CommonUploaderButton, type UploaderConfig } from "uploader"

import { BlockPageRoot } from "@/components/blocks/block-page-root"
import { LayoutShellSidebarSlots } from "@/components/blocks/block-shell-slots"
import { demoAccountUploaderColumns } from "@/components/examples/uploader/demo-uploader-columns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/packages/ui/components/card"

const slots = LayoutShellSidebarSlots()

export function UploaderImportBlock() {
	const config = useMemo<UploaderConfig>(
		() => ({
			entity: "demo-account",
			entityLabel: "accounts",
			title: "Import accounts",
			description:
				"Upload a CSV or Excel file using the sample template. Rows are validated in the browser; no API is called in this demo.",
			fileFormat: "standard",
			templateFileName: "demo-account-import-template",
			acceptedFileTypes: ".xlsx,.csv",
			columns: demoAccountUploaderColumns,
			defaultMode: "create",
			transport: "records",
			historyHref: "/docs/blocks/uploader-import",
		}),
		[],
	)

	return (
		<BlockPageRoot>
			<DashboardShell {...slots}>
				<ContentPageHeader
					description="End-to-end import flow with template download, mapping, and validation."
					title="Import data"
				/>
				<div className="mt-6 grid gap-4 lg:grid-cols-2">
					<Card className="shadow-sm">
						<CardHeader>
							<CardTitle className="text-base">Start import</CardTitle>
							<CardDescription>
								Opens the uploader dialog with column mapping and row-level errors.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<CommonUploaderButton
								config={config}
								redirectOnSuccess={false}
								triggerLabel="Import accounts"
								onUpload={async ({ records }) => {
									await new Promise((resolve) => {
										window.setTimeout(resolve, 500)
									})
									return {
										success: true,
										message: `Imported ${records.length} row(s) (demo only).`,
									}
								}}
							/>
						</CardContent>
					</Card>
					<Card className="shadow-sm">
						<CardHeader>
							<CardTitle className="text-base">Before you upload</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-muted-foreground text-sm">
							<p>1. Download the template and fill required columns.</p>
							<p>2. Keep headers on the first row.</p>
							<p>3. Review validation results before confirming.</p>
						</CardContent>
					</Card>
				</div>
			</DashboardShell>
		</BlockPageRoot>
	)
}
