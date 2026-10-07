export type DocsNavItem = {
	title: string
	href: string
}

/** Top-level docs pages (kits + intro). Example previews live on separate routes. */
export const docsNavItems: DocsNavItem[] = [
	{ title: "Introduction", href: "/docs" },
	{ title: "Getting started", href: "/docs/getting-started" },
	{ title: "Form", href: "/docs/form" },
	{ title: "Data table", href: "/docs/data-table" },
	{ title: "Layout", href: "/docs/layout" },
	{ title: "Uploader", href: "/docs/uploader" },
	{ title: "UI", href: "/docs/ui" },
]

export function isDocsNavActive(href: string, pathname: string) {
	if (href === "/docs") {
		return pathname === "/docs" || pathname === "/docs/index"
	}
	return pathname === href || pathname.startsWith(`${href}/`)
}
