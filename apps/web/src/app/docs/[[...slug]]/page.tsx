import { findNeighbour } from "fumadocs-core/page-tree"
import { createRelativeLink } from "fumadocs-ui/mdx"
import { DocsBody, DocsDescription, DocsTitle } from "fumadocs-ui/layouts/docs/page"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DocsPager } from "@/components/docs/docs-pager"
import { getMDXComponents } from "@/components/mdx"
import { source } from "@/lib/source"

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
	const params = await props.params
	const page = source.getPage(params.slug)
	if (!page) notFound()

	const MDX = page.data.body
	const tree = source.getPageTree()
	const neighbours = findNeighbour(tree, page.url)
	const previous = neighbours.previous
		? { name: String(neighbours.previous.name), url: neighbours.previous.url }
		: null
	const next = neighbours.next ? { name: String(neighbours.next.name), url: neighbours.next.url } : null

	return (
		<article className="mx-auto w-full max-w-6xl min-w-0">
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription>{page.data.description}</DocsDescription>
			<DocsBody>
				<MDX
					components={getMDXComponents({
						a: createRelativeLink(source, page),
					})}
				/>
			</DocsBody>
			<DocsPager previous={previous} next={next} />
		</article>
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
