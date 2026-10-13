import { notFound } from "next/navigation"

import { BLOCK_PREVIEW_COMPONENTS } from "@/components/blocks/block-preview-map"
import { BLOCK_BY_SLUG, BLOCKS, type BlockSlug } from "@/lib/blocks/catalog"

type PageProps = {
	params: Promise<{ slug: string }>
}

export function generateStaticParams() {
	return BLOCKS.map((block) => ({ slug: block.slug }))
}

export default async function BlockPreviewPage({ params }: PageProps) {
	const { slug } = await params
	const key = slug as BlockSlug
	if (!BLOCK_BY_SLUG[key]) {
		notFound()
	}
	const Block = BLOCK_PREVIEW_COMPONENTS[key]
	return <Block />
}
