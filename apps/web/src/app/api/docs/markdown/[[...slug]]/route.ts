import { readFile } from "node:fs/promises"

import { source } from "@/lib/source"
import { resolveDocsMarkdownFile } from "@/lib/docs-markdown-path"

type RouteContext = {
	params: Promise<{ slug?: string[] }>
}

export async function GET(_request: Request, context: RouteContext) {
	const { slug } = await context.params
	const page = source.getPage(slug)
	if (!page) {
		return new Response("Not found", { status: 404 })
	}

	const filePath = resolveDocsMarkdownFile(slug)
	if (!filePath) {
		return new Response("Not found", { status: 404 })
	}

	try {
		const content = await readFile(filePath, "utf8")
		return new Response(content, {
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Cache-Control": "public, max-age=3600",
			},
		})
	} catch {
		return new Response("Not found", { status: 404 })
	}
}
