export type ExampleKit = "form" | "table" | "layout" | "uploader"

export type ExampleVisualId =
	| "form-basic"
	| "form-field-types"
	| "form-validation"
	| "form-field-kit"
	| "table-basic"
	| "table-empty"
	| "table-loading"
	| "table-filters"
	| "table-bulk"
	| "table-row-actions"
	| "table-url-sync"
	| "layout-breadcrumbs"
	| "layout-utility"
	| "uploader-basic"

export type ExampleItem = {
	title: string
	description: string
	href: string
	kit: ExampleKit
	visual: ExampleVisualId
}

export type ExampleCategory = {
	id: ExampleKit
	title: string
	docsHref: string
	items: ExampleItem[]
}

export const EXAMPLE_CATEGORIES: ExampleCategory[] = [
	{
		id: "form",
		title: "Form",
		docsHref: "/docs/form",
		items: [
			{
				title: "FormKit — basic",
				description: "Submit flow with sections and actions",
				href: "/docs/examples/form/basic",
				kit: "form",
				visual: "form-basic",
			},
			{
				title: "FormKit — field types",
				description: "Every supported FormKit.Field type",
				href: "/docs/examples/form/field-types",
				kit: "form",
				visual: "form-field-types",
			},
			{
				title: "FormKit — validation",
				description: "Client + server error mapping",
				href: "/docs/examples/form/validation",
				kit: "form",
				visual: "form-validation",
			},
			{
				title: "FieldKit — filters",
				description: "Controlled filter row without submit",
				href: "/docs/examples/form/field-kit",
				kit: "form",
				visual: "form-field-kit",
			},
		],
	},
	{
		id: "table",
		title: "Data table",
		docsHref: "/docs/data-table",
		items: [
			{
				title: "Basic",
				description: "Columns, selection, pagination",
				href: "/docs/examples/table/basic",
				kit: "table",
				visual: "table-basic",
			},
			{
				title: "Empty state",
				description: "Custom zero-data UI",
				href: "/docs/examples/table/empty",
				kit: "table",
				visual: "table-empty",
			},
			{
				title: "Loading",
				description: "Skeleton body while fetching",
				href: "/docs/examples/table/loading",
				kit: "table",
				visual: "table-loading",
			},
			{
				title: "Filters",
				description: "Toolbar search and facets",
				href: "/docs/examples/table/filters",
				kit: "table",
				visual: "table-filters",
			},
			{
				title: "Bulk actions",
				description: "Selection bar + export",
				href: "/docs/examples/table/bulk-actions",
				kit: "table",
				visual: "table-bulk",
			},
			{
				title: "Row actions",
				description: "Per-row menu",
				href: "/docs/examples/table/row-actions",
				kit: "table",
				visual: "table-row-actions",
			},
			{
				title: "URL sync",
				description: "Query string state",
				href: "/docs/examples/table/url-sync",
				kit: "table",
				visual: "table-url-sync",
			},
		],
	},
	{
		id: "layout",
		title: "Layout",
		docsHref: "/docs/layout",
		items: [
			{
				title: "Breadcrumbs",
				description: "Trail + back affordance",
				href: "/docs/examples/layout/breadcrumbs",
				kit: "layout",
				visual: "layout-breadcrumbs",
			},
			{
				title: "Utility buttons",
				description: "Docs / refresh / info icons",
				href: "/docs/examples/layout/utility-buttons",
				kit: "layout",
				visual: "layout-utility",
			},
		],
	},
	{
		id: "uploader",
		title: "Uploader",
		docsHref: "/docs/uploader",
		items: [
			{
				title: "Basic import",
				description: "Template download + records transport",
				href: "/docs/examples/uploader/basic",
				kit: "uploader",
				visual: "uploader-basic",
			},
		],
	},
]
