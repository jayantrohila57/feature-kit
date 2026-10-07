import { decodePathSegment } from "./breadcrumb-url-utils"

type Crumb = {
	href: string
	label: string
}

type SearchParamsLike = {
	get(name: string): string | null
}

/** Segments that follow a dynamic entity id/name in the path (e.g. `/items/[name]/edit`). */
const ENTITY_SUFFIX_SEGMENTS = new Set(["edit"])

/** Terminal route segments that are not dynamic entity identifiers. */
const STATIC_LEAF_SEGMENTS = new Set([
	"create",
	"bulk-import",
	"export",
	"overview",
	"basic",
	"validation",
	"field-types",
	"field-kit",
	"empty",
	"loading",
	"filters",
	"bulk-actions",
	"row-actions",
	"url-sync",
	"breadcrumbs",
])

function getEntitySegmentIndex(segments: string[]): number | null {
	if (segments.length === 0) return null

	const last = segments[segments.length - 1]
	if (!last) return null

	if (ENTITY_SUFFIX_SEGMENTS.has(last)) {
		const index = segments.length - 2
		return index >= 0 ? index : null
	}

	if (STATIC_LEAF_SEGMENTS.has(last)) return null

	return segments.length - 1
}

/** Resolve a breadcrumb label: query `name` → decoded path segment → raw segment. */
export function resolveCrumbLabel(
	segment: string,
	options: {
		segmentIndex: number
		segments: string[]
		searchParams?: SearchParamsLike | null
	},
): string {
	const nameParam = options.searchParams?.get("name")?.trim()
	if (nameParam) {
		const entityIndex = getEntitySegmentIndex(options.segments)
		if (entityIndex !== null && options.segmentIndex === entityIndex) {
			return nameParam
		}
	}

	return decodePathSegment(segment) || segment
}

type CrumbWithHidden = Crumb & {
	hidden: Crumb[]
}

export type CrumbNode = Crumb | CrumbWithHidden

export function hasHidden(node: CrumbNode): node is CrumbWithHidden {
	return "hidden" in node
}

export function generateBreadcrumbs(pathname: string, searchParams?: SearchParamsLike | null): Crumb[] {
	const segments = pathname.split("/").filter(Boolean)
	return segments.map((segment, index) => {
		const labelOptions: Parameters<typeof resolveCrumbLabel>[1] = { segmentIndex: index, segments }
		if (searchParams) labelOptions.searchParams = searchParams
		return {
			href: `/${segments.slice(0, index + 1).join("/")}`,
			label: resolveCrumbLabel(segment, labelOptions),
		}
	})
}

export function compressBreadcrumbs(items: Crumb[]): { visible: CrumbNode[]; hidden: Crumb[] } {
	if (items.length <= 3) return { visible: items, hidden: [] }

	const first = items[0]
	const secondLast = items[items.length - 2]
	const last = items[items.length - 1]
	if (!first || !secondLast || !last) return { visible: items, hidden: [] }

	const hidden = items.slice(1, items.length - 2)

	return {
		visible: [first, { href: "", label: "...", hidden }, secondLast, last],
		hidden,
	}
}

/** App root for the home crumb (playground has no locale prefix in the URL). */
export function resolveHomeHref(_locale?: string): string {
	return "/"
}

/** True when the home target should use a plain anchor instead of client navigation. */
export function isExternalOrPortalHome(href: string): boolean {
	return /^https?:\/\//i.test(href)
}
