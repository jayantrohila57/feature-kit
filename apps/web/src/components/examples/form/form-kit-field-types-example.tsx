"use client"

import { FormKit } from "form"
import { FormSection } from "layout"
import { toast } from "sonner"
import { z } from "zod"

const schema = z.object({
	title: z.string().min(1),
	summary: z.string().min(1),
	plan: z.enum(["free", "pro", "team"]),
	tags: z.array(z.string()).min(1),
	enabled: z.boolean(),
	notifyEmail: z.boolean(),
	visibility: z.enum(["public", "private"]),
	layout: z.enum(["list", "board"]),
	startDate: z.string().optional(),
	range: z
		.object({
			from: z.string().optional(),
			to: z.string().optional(),
		})
		.optional(),
	month: z.string().optional(),
	quarter: z.string().optional(),
	startTime: z.string().optional(),
	proPlan: z.boolean().optional(),
	emailAlerts: z.boolean().optional(),
})

const planOptions = [
	{ value: "free", label: "Free" },
	{ value: "pro", label: "Pro" },
	{ value: "team", label: "Team" },
]

const tagOptions = [
	{ value: "docs", label: "Documentation" },
	{ value: "api", label: "API" },
	{ value: "ui", label: "UI" },
]

const visibilityOptions = [
	{ value: "public", label: "Public", description: "Anyone with the link can view." },
	{ value: "private", label: "Private", description: "Only members of your workspace." },
]

const layoutOptions = [
	{ value: "list", label: "List", description: "Dense rows for scanning." },
	{ value: "board", label: "Board", description: "Columns for workflow stages." },
]

const defaultValues: z.input<typeof schema> = {
	title: "Sample project",
	summary: "Demonstrates every field type in the registry.",
	plan: "pro",
	tags: ["docs"],
	enabled: true,
	notifyEmail: false,
	visibility: "private",
	layout: "list",
	proPlan: true,
	emailAlerts: true,
}

export function FormKitFieldTypesExample() {
	return (
		<FormKit
			schema={schema}
			defaultValues={defaultValues}
			onSubmit={async (values) => {
				toast.success("Form submitted", { description: values.title })
			}}>
			<FormSection title="Text & choice" description="Strings, selects, and toggles.">
				<FormKit.Field type="text" name="title" label="Title" required />
				<FormKit.Field type="textarea" name="summary" label="Summary" />
				<FormKit.Field type="select" name="plan" label="Plan" options={planOptions} />
				<FormKit.Field
					type="multi-select"
					name="tags"
					label="Tags"
					options={tagOptions}
					showSelectedCount
				/>
				<FormKit.Field type="checkbox" name="enabled" label="Project enabled" />
				<FormKit.Field type="switch" name="notifyEmail" label="Notify by email" />
			</FormSection>
			<FormSection title="Choice cards" description="Radio and boolean cards for richer labels.">
				<FormKit.Field type="radio-group" name="visibility" label="Visibility" options={visibilityOptions} />
				<FormKit.Field type="radio-choice-card" name="layout" label="Layout" options={layoutOptions} />
				<FormKit.Field
					type="switch-choice-card"
					name="proPlan"
					label="Pro features"
					description="Enable advanced reporting for this project."
				/>
				<FormKit.Field
					type="checkbox-choice-card"
					name="emailAlerts"
					label="Email alerts"
					description="Send a digest when activity changes."
				/>
			</FormSection>
			<FormSection title="Dates & time" description="ISO-friendly string values in the schema.">
				<FormKit.Field type="date" name="startDate" label="Start date" />
				<FormKit.Field type="date-range" name="range" label="Date range" />
				<FormKit.Field type="month" name="month" label="Month" />
				<FormKit.Field type="quarter" name="quarter" label="Quarter" />
				<FormKit.Field type="time" name="startTime" label="Start time" />
			</FormSection>
			<FormKit.Actions>
				<FormKit.Submit label="Submit" pendingLabel="Submitting…" />
			</FormKit.Actions>
		</FormKit>
	)
}
