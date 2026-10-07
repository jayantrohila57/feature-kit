import { existsSync } from "node:fs"
import path from "node:path"

const DOCS_CONTENT_ROOT = path.join(process.cwd(), "content/docs")

/**
 * Resolves a docs slug to an on-disk MDX file under `content/docs`.
 * Returns null when the path escapes the docs root or no file exists.
 */
export function resolveDocsMarkdownFile(slug: string[] | undefined): string | null {
	const segments = slug?.length ? slug : ["index"]
	const resolvedRoot = path.resolve(DOCS_CONTENT_ROOT)
	const base = path.resolve(DOCS_CONTENT_ROOT, ...segments)

	if (!base.startsWith(resolvedRoot)) {
		return null
	}

	const candidates = [`${base}.mdx`, path.join(base, "index.mdx")]

	for (const candidate of candidates) {
		const resolved = path.resolve(candidate)
		if (!resolved.startsWith(resolvedRoot) || !resolved.endsWith(".mdx")) {
			continue
		}
		if (existsSync(resolved)) {
			return resolved
		}
	}

	return null
}

export function docsMarkdownApiPath(slug: string[] | undefined): string {
	if (!slug?.length) {
		return "/api/docs/markdown"
	}
	return `/api/docs/markdown/${slug.map(encodeURIComponent).join("/")}`
}
