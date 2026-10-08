import type { MetadataRoute } from "next"

import { source } from "@/lib/source"
import { getSiteOrigin } from "@/lib/site-url"

export default function sitemap(): MetadataRoute.Sitemap {
	const origin = getSiteOrigin()

	const docsEntries: MetadataRoute.Sitemap = source.getPages().map((page) => ({
		url: `${origin}${page.url}`,
	}))

	return [
		{
			url: `${origin}/`,
		},
		...docsEntries,
	]
}
