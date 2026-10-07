import type { LucideIcon } from "lucide-react"
import {
	Blocks,
	FileSpreadsheet,
	FormInput,
	LayoutGrid,
	PanelTop,
	Table2,
	Upload,
} from "lucide-react"

export const githubUrl = "https://github.com/jayantrohila57/feature-kit"

export type SiteNavLink = {
	title: string
	href: string
	icon: LucideIcon
	description?: string
}

export const kitLinks: SiteNavLink[] = [
	{
		title: "Form",
		href: "/docs/form",
		description: "Fields, validation, and form kit patterns",
		icon: FormInput,
	},
	{
		title: "Data table",
		href: "/docs/data-table",
		description: "Filters, pagination, URL sync, and bulk actions",
		icon: Table2,
	},
	{
		title: "Layout",
		href: "/docs/layout",
		description: "Shell, breadcrumbs, and utility buttons",
		icon: LayoutGrid,
	},
	{
		title: "Uploader",
		href: "/docs/uploader",
		description: "Import flows and file upload UI",
		icon: Upload,
	},
	{
		title: "UI",
		href: "/docs/ui",
		description: "Shared primitives from the workspace UI package",
		icon: Blocks,
	},
]

export const exampleFeaturedLinks: SiteNavLink[] = [
	{
		title: "Examples overview",
		href: "/docs/examples",
		description: "Live previews for every kit",
		icon: PanelTop,
	},
	{
		title: "Form basic",
		href: "/docs/examples/form/basic",
		description: "Controlled form with validation",
		icon: FormInput,
	},
	{
		title: "Table filters",
		href: "/docs/examples/table/filters",
		description: "Toolbar search, sort, and filters",
		icon: FileSpreadsheet,
	},
]

export const exampleQuickLinks: SiteNavLink[] = [
	{ title: "Form field kit", href: "/docs/examples/form/field-kit", icon: FormInput },
	{ title: "Table URL sync", href: "/docs/examples/table/url-sync", icon: Table2 },
	{ title: "Layout breadcrumbs", href: "/docs/examples/layout/breadcrumbs", icon: LayoutGrid },
	{ title: "Uploader basic", href: "/docs/examples/uploader/basic", icon: Upload },
]
