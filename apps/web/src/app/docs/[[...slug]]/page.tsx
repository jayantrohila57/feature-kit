import { createRelativeLink } from "fumadocs-ui/mdx"
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DocsPageActions } from "@/components/docs/docs-page-actions"
import { DocsPageFooter } from "@/components/docs/docs-page-footer"
import { getMDXComponents } from "@/components/mdx"
import { getDocsFooterItems } from "@/lib/docs-footer"
import { docsMarkdownApiPath } from "@/lib/docs-markdown-path"
import { source } from "@/lib/source"

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
	const params = await props.params
	const page = source.getPage(params.slug)
	if (!page) notFound()

	const MDX = page.data.body

	const { previous, next } = getDocsFooterItems(params.slug)
	const footerItems = {
		...(previous ? { previous } : {}),
		...(next ? { next } : {}),
	}

	return (
		<DocsPage
			full
			className="max-w-none"
			footer={{ enabled: true, items: footerItems }}
			slots={{ footer: DocsPageFooter }}
			tableOfContent={{ enabled: true }}
			toc={page.data.toc}>
			<div className="not-prose flex flex-wrap items-center justify-between gap-3">
				<DocsTitle className="min-w-0 flex-1">{page.data.title}</DocsTitle>
				<DocsPageActions
					markdownUrl={docsMarkdownApiPath(params.slug)}
					pagePath={page.url}
					{...(previous ? { previous } : {})}
					{...(next ? { next } : {})}
				/>
			</div>
			<DocsDescription>{page.data.description}</DocsDescription>
			<DocsBody>
				<MDX
					components={getMDXComponents({
						a: createRelativeLink(source, page),
					})}
				/>
			</DocsBody>
		</DocsPage>
	)
}

export function generateStaticParams() {
	return source.generateParams()
}

export async function generateMetadata(props: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
	const params = await props.params
	const page = source.getPage(params.slug)
	if (!page) notFound()

	return {
		title: page.data.title,
		description: page.data.description,
	}
}
