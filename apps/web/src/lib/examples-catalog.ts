export type ExampleEntry = {
	slug: string
	title: string
	description: string
}

export const formExamples: ExampleEntry[] = [
	{
		slug: "basic",
		title: "FormKit — basic",
		description: "Sections, text/select/switch, submit, reset, and reset on success.",
	},
	{
		slug: "field-types",
		title: "FormKit — field types",
		description: "All field types shipped in this kit in one schema-driven form.",
	},
	{
		slug: "validation",
		title: "FormKit — validation",
		description: "Zod rules, client errors, and focus on the first invalid field after submit.",
	},
	{
		slug: "field-kit",
		title: "FieldKit — filters",
		description: "Controlled filter surface (search + multi-select) without a full submit lifecycle.",
	},
]

export const uploaderExamples: ExampleEntry[] = [
	{
		slug: "basic",
		title: "Uploader — basic",
		description: "Spreadsheet import dialog with template download, validation, and a mock upload handler.",
	},
]

export const layoutExamples: ExampleEntry[] = [
	{
		slug: "breadcrumbs",
		title: "Layout — breadcrumbs",
		description: "Path-derived crumbs with ellipsis, tooltips, and copy-link.",
	},
	{
		slug: "utility-buttons",
		title: "Layout — utility buttons",
		description: "Icon actions with shared tooltip and loading behavior (back, docs, refresh).",
	},
]

export const tableExamples: ExampleEntry[] = [
	{
		slug: "basic",
		title: "DataTable — basic",
		description: "Columns, row selection, and toolbar with client-only state.",
	},
	{
		slug: "empty",
		title: "DataTable — empty",
		description: "Custom empty state when there are no rows.",
	},
	{
		slug: "loading",
		title: "DataTable — loading",
		description: "Pending skeleton overlay while data is refreshing.",
	},
	{
		slug: "filters",
		title: "DataTable — filters",
		description: "Column search, sort, and option filters in the toolbar.",
	},
	{
		slug: "bulk-actions",
		title: "DataTable — bulk actions",
		description: "Cross-page selection with a floating bulk action bar.",
	},
	{
		slug: "row-actions",
		title: "DataTable — row actions",
		description: "Per-row menu with confirm-on-delete pattern.",
	},
	{
		slug: "url-sync",
		title: "DataTable — URL sync",
		description: "Pagination, search, and filters reflected in the query string.",
	},
]
