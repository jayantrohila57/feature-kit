import { source } from "@/lib/source"

export type DocsFooterItem = {
	name: string
	description?: string | undefined
	url: string
}

export function getDocsFooterItems(slug?: string[]): {
	previous?: DocsFooterItem | undefined
	next?: DocsFooterItem | undefined
} {
	const pages = source.getPages()
	const currentUrl = slug?.length ? `/docs/${slug.join("/")}` : "/docs"
	const index = pages.findIndex((page) => page.url === currentUrl)
	if (index === -1) {
		return {}
	}

	const toItem = (page: (typeof pages)[number]): DocsFooterItem => {
		const item: DocsFooterItem = {
			name: page.data.title,
			url: page.url,
		}
		if (page.data.description) {
			item.description = page.data.description
		}
		return item
	}

	const previousPage = index > 0 ? pages[index - 1] : undefined
	const nextPage = index < pages.length - 1 ? pages[index + 1] : undefined

	return {
		previous: previousPage ? toItem(previousPage) : undefined,
		next: nextPage ? toItem(nextPage) : undefined,
	}
}
