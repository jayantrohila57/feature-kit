import { createRelativeLink } from "fumadocs-ui/mdx"
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DocsPageFooter } from "@/components/docs/docs-page-footer"
import { getMDXComponents } from "@/components/mdx"
import { getDocsFooterItems } from "@/lib/docs-footer"
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
			footer={{ enabled: true, items: footerItems }}
			slots={{ footer: DocsPageFooter }}
			tableOfContent={{ enabled: true }}
			toc={page.data.toc}>
			<DocsTitle>{page.data.title}</DocsTitle>
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
