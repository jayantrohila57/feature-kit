import type { NextConfig } from "next"
import { createMDX } from "fumadocs-mdx/next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")
const withMDX = createMDX()

const nextConfig: NextConfig = {
	async redirects() {
		return [
			{ source: "/examples", destination: "/docs/examples", permanent: false },
			{ source: "/examples/form", destination: "/docs/examples/form/basic", permanent: false },
			{ source: "/examples/table", destination: "/docs/examples/table/basic", permanent: false },
			{ source: "/examples/layout", destination: "/docs/examples/layout/breadcrumbs", permanent: false },
			{ source: "/examples/uploader", destination: "/docs/examples/uploader/basic", permanent: false },
			{ source: "/examples/:path*", destination: "/docs/examples/:path*", permanent: false },
			{ source: "/form", destination: "/docs/examples/form/basic", permanent: false },
			{ source: "/table", destination: "/docs/examples/table/basic", permanent: false },
		]
	},
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
