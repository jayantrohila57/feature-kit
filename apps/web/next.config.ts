import type { NextConfig } from "next"
import { createMDX } from "fumadocs-mdx/next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")
const withMDX = createMDX()

const nextConfig: NextConfig = {
	transpilePackages: [
		"data-table",
		"export",
		"format",
		"form",
		"layout",
		"preferences",
		"ui",
	],
}

export default withNextIntl(withMDX(nextConfig))
