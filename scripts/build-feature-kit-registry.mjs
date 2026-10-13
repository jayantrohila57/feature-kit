#!/usr/bin/env node
/**
 * Generates shadcn registry JSON under apps/web/public/r from feature-kit sources.
 */
import { spawnSync } from "node:child_process"
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const GENERATED = path.join(ROOT, "registry", ".generated")
const STAGING = path.join(GENERATED, "files")
const PUBLIC_R = path.join(ROOT, "apps", "web", "public", "r")

const SITE = "https://feature-kits.vercel.app"

/** @type {Record<string, {
  title: string
  description: string
  includeGlobs: string[]
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  categories?: string[]
  docs?: string
}>} */
const KITS = {
	theme: {
		title: "Theme kit",
		description: "next-themes provider, toggle, selector, and preference sync.",
		includeGlobs: [
			"feature/theme/src/**/*.{ts,tsx}",
			"feature/preferences/src/**/*.{ts,tsx}",
		],
		dependencies: ["next-themes", "lucide-react", "zod"],
		registryDependencies: ["button", "dropdown-menu", "tooltip"],
		categories: ["theme"],
		docs: "Mount ThemeProvider in your root layout. Import ui/globals.css once.",
	},
	breadcrumb: {
		title: "Breadcrumb kit",
		description: "Route-derived breadcrumbs with ellipsis menu and copy URL.",
		includeGlobs: ["feature/layout/src/breadcrumb/**/*.{ts,tsx}"],
		dependencies: ["lucide-react", "next-intl", "sonner"],
		registryDependencies: ["breadcrumb", "button", "dropdown-menu", "tooltip"],
		categories: ["layout", "navigation"],
	},
	layout: {
		title: "Layout kit",
		description: "Form sections, navigation helpers, confirmation dialog, and shared layout utilities.",
		includeGlobs: [
			"feature/layout/src/**/*.{ts,tsx}",
			"!feature/layout/src/shell/**",
			"!feature/layout/src/breadcrumb/**",
		],
		dependencies: ["lucide-react", "next-intl", "sonner"],
		registryDependencies: [
			"@feature-kit/breadcrumb",
			"button",
			"dialog",
			"separator",
			"sheet",
			"sidebar",
			"tooltip",
		],
		categories: ["layout"],
	},
	"dashboard-shell": {
		title: "Dashboard shell",
		description: "DashboardShell, header, sidebar nav, and account menu composition.",
		includeGlobs: ["feature/layout/src/shell/**/*.{ts,tsx}"],
		dependencies: ["lucide-react", "next-intl", "sonner"],
		registryDependencies: [
			"@feature-kit/layout",
			"@feature-kit/breadcrumb",
			"sidebar",
			"separator",
			"button",
			"dropdown-menu",
			"tooltip",
		],
		categories: ["layout", "dashboard"],
	},
	form: {
		title: "Form kit",
		description: "FormKit and FieldKit — Zod schemas with React Hook Form.",
		includeGlobs: ["feature/form/src/**/*.{ts,tsx}"],
		dependencies: [
			"@hookform/resolvers",
			"date-fns",
			"lucide-react",
			"react-day-picker",
			"react-hook-form",
			"zod",
		],
		registryDependencies: [
			"@feature-kit/layout",
			"button",
			"calendar",
			"checkbox",
			"input",
			"label",
			"popover",
			"select",
			"switch",
			"textarea",
		],
		categories: ["form"],
	},
	"data-table": {
		title: "Data table kit",
		description: "TanStack Table wrapper with filters, bulk actions, and URL sync.",
		includeGlobs: [
			"feature/data-table/src/**/*.{ts,tsx}",
			"feature/export/src/**/*.{ts,tsx}",
			"packages/format/src/**/*.{ts,tsx}",
		],
		dependencies: [
			"@dnd-kit/core",
			"@dnd-kit/sortable",
			"@dnd-kit/utilities",
			"@tanstack/react-table",
			"lucide-react",
			"next-intl",
			"nuqs",
			"sonner",
			"zod",
		],
		registryDependencies: [
			"@feature-kit/layout",
			"@feature-kit/form",
			"button",
			"checkbox",
			"dropdown-menu",
			"input",
			"select",
			"table",
		],
		categories: ["table"],
	},
	auth: {
		title: "Auth kit",
		description: "better-auth wiring, sign-in/up modules, and demo-friendly memory adapter.",
		includeGlobs: ["feature/auth/src/**/*.{ts,tsx}"],
		dependencies: ["better-auth", "lucide-react", "server-only", "sonner", "zod"],
		registryDependencies: ["@feature-kit/form", "button", "input", "label", "separator"],
		categories: ["auth"],
		docs: "Add auth API route and env vars for your IdP. See /docs/auth for demo mode.",
	},
	uploader: {
		title: "Uploader kit",
		description: "Spreadsheet import UI with validation and FormKit integration.",
		includeGlobs: ["feature/uploader/src/**/*.{ts,tsx}"],
		dependencies: ["lucide-react", "next-intl", "sonner", "xlsx", "zod"],
		registryDependencies: ["@feature-kit/form", "button", "dialog", "table"],
		categories: ["uploader"],
	},
}

/** @type {Record<string, {
  title: string
  description: string
  sourceFiles: string[]
  dependencies?: string[]
  registryDependencies?: string[]
  categories?: string[]
}>} */
const BLOCKS = {
	"blocks-dashboard-overview": {
		title: "Block — dashboard overview",
		description: "Full-page dashboard with stats, chart, and recent table.",
		sourceFiles: [
			"apps/web/src/components/blocks/pages/dashboard-overview-block.tsx",
			"apps/web/src/components/blocks/block-page-root.tsx",
			"apps/web/src/components/examples/layout/shell/layout-shell-shared.tsx",
			"apps/web/src/components/examples/layout/shell/layout-demo-nav.ts",
			"apps/web/src/components/examples/table/demo-rows.ts",
		],
		dependencies: ["lucide-react", "sonner"],
		registryDependencies: [
			"@feature-kit/dashboard-shell",
			"@feature-kit/data-table",
			"@feature-kit/theme",
			"card",
			"table",
		],
		categories: ["blocks", "dashboard"],
	},
	"blocks-data-table-crud": {
		title: "Block — data table CRUD",
		description: "Filtered table with row actions and sheet form.",
		sourceFiles: [
			"apps/web/src/components/blocks/pages/data-table-crud-block.tsx",
			"apps/web/src/components/blocks/block-page-root.tsx",
			"apps/web/src/components/examples/layout/shell/layout-shell-shared.tsx",
			"apps/web/src/components/examples/layout/shell/layout-demo-nav.ts",
			"apps/web/src/components/examples/table/demo-rows.ts",
		],
		dependencies: ["lucide-react", "sonner", "zod"],
		registryDependencies: [
			"@feature-kit/dashboard-shell",
			"@feature-kit/data-table",
			"@feature-kit/form",
			"button",
			"sheet",
		],
		categories: ["blocks", "table"],
	},
	"blocks-detail-page": {
		title: "Block — detail page",
		description: "Breadcrumbs, header, and tabbed detail sections.",
		sourceFiles: [
			"apps/web/src/components/blocks/pages/detail-page-block.tsx",
			"apps/web/src/components/blocks/block-page-root.tsx",
			"apps/web/src/components/examples/layout/shell/layout-shell-shared.tsx",
			"apps/web/src/components/examples/layout/shell/layout-demo-nav.ts",
		],
		dependencies: ["lucide-react"],
		registryDependencies: ["@feature-kit/dashboard-shell", "badge", "card", "separator", "tabs"],
		categories: ["blocks"],
	},
	"blocks-settings-area": {
		title: "Block — settings area",
		description: "Secondary nav, profile, preferences, and theme.",
		sourceFiles: [
			"apps/web/src/components/blocks/pages/settings-area-block.tsx",
			"apps/web/src/components/blocks/block-page-root.tsx",
			"apps/web/src/components/examples/layout/shell/layout-shell-shared.tsx",
			"apps/web/src/components/examples/layout/shell/layout-demo-nav.ts",
		],
		dependencies: ["lucide-react"],
		registryDependencies: [
			"@feature-kit/dashboard-shell",
			"@feature-kit/theme",
			"input",
			"label",
			"switch",
			"textarea",
		],
		categories: ["blocks", "settings"],
	},
	"blocks-auth-pages": {
		title: "Block — auth pages",
		description: "Sign-in, sign-up, forgot password, and split layouts.",
		sourceFiles: ["apps/web/src/components/blocks/pages/auth-pages-block.tsx", "apps/web/src/components/blocks/block-page-root.tsx"],
		dependencies: ["lucide-react"],
		registryDependencies: ["@feature-kit/layout", "@feature-kit/auth", "button"],
		categories: ["blocks", "auth"],
	},
	"blocks-uploader-import": {
		title: "Block — uploader import",
		description: "Full-page import flow with uploader kit.",
		sourceFiles: [
			"apps/web/src/components/blocks/pages/uploader-import-block.tsx",
			"apps/web/src/components/blocks/block-page-root.tsx",
			"apps/web/src/components/examples/layout/shell/layout-shell-shared.tsx",
			"apps/web/src/components/examples/layout/shell/layout-demo-nav.ts",
			"apps/web/src/components/examples/uploader/demo-uploader-columns.ts",
		],
		dependencies: ["lucide-react"],
		registryDependencies: ["@feature-kit/dashboard-shell", "@feature-kit/uploader", "card"],
		categories: ["blocks", "uploader"],
	},
	"blocks-app-states": {
		title: "Block — app states",
		description: "Empty, loading, and error table states.",
		sourceFiles: [
			"apps/web/src/components/blocks/pages/app-states-block.tsx",
			"apps/web/src/components/blocks/block-page-root.tsx",
			"apps/web/src/components/examples/layout/shell/layout-shell-shared.tsx",
			"apps/web/src/components/examples/layout/shell/layout-demo-nav.ts",
			"apps/web/src/components/examples/table/demo-rows.ts",
		],
		dependencies: ["lucide-react"],
		registryDependencies: ["@feature-kit/dashboard-shell", "@feature-kit/data-table", "alert", "button"],
		categories: ["blocks"],
	},
	"blocks-top-nav-app": {
		title: "Block — top nav app",
		description: "Top navigation without sidebar.",
		sourceFiles: [
			"apps/web/src/components/blocks/pages/top-nav-app-block.tsx",
			"apps/web/src/components/blocks/block-page-root.tsx",
			"apps/web/src/components/examples/layout/shell/layout-shell-shared.tsx",
		],
		dependencies: ["lucide-react"],
		registryDependencies: ["@feature-kit/dashboard-shell", "@feature-kit/theme", "card"],
		categories: ["blocks", "navigation"],
	},
}

function transformBlockImports(content) {
	return transformSource(content, "block")
		.replaceAll("@/components/blocks/block-shell-slots", "@/components/examples/layout/shell/layout-shell-shared")
		.replaceAll(
			"@/components/blocks/block-page-root",
			"@/components/blocks/block-page-root",
		)
}

function targetPathForBlockFile(relativePath) {
	const normalized = relativePath.replace(/^apps\/web\/src\//, "")
	return `@components/${normalized}`
}

async function stageBlock(name, config) {
	const files = []
	for (const rel of config.sourceFiles) {
		const abs = path.join(ROOT, rel)
		const raw = await fs.readFile(abs, "utf8")
		const content = transformBlockImports(raw)
		const target = targetPathForBlockFile(rel)
		const stagingRel = target.replace(/^@components\//, "components/")
		const stagingPath = path.join(STAGING, stagingRel)
		await fs.mkdir(path.dirname(stagingPath), { recursive: true })
		await fs.writeFile(stagingPath, content)
		files.push({
			path: path.relative(GENERATED, stagingPath),
			type: "registry:component",
			target: `${target}`,
		})
	}
	return files
}

function transformSource(content, kitName) {
	return content
		.replaceAll("@/packages/ui/components/", "@/components/ui/")
		.replaceAll("@/packages/ui/lib/", "@/lib/")
		.replaceAll('from "ui"', 'from "@/components/ui"')
		.replaceAll('from "layout"', 'from "@/lib/feature-kit/layout"')
		.replaceAll('from "layout/', 'from "@/lib/feature-kit/layout/')
		.replaceAll('from "form"', 'from "@/lib/feature-kit/form"')
		.replaceAll('from "form/', 'from "@/lib/feature-kit/form/')
		.replaceAll('from "data-table"', 'from "@/lib/feature-kit/data-table"')
		.replaceAll('from "data-table/', 'from "@/lib/feature-kit/data-table/')
		.replaceAll('from "auth"', 'from "@/lib/feature-kit/auth"')
		.replaceAll('from "auth/', 'from "@/lib/feature-kit/auth/')
		.replaceAll('from "theme"', 'from "@/lib/feature-kit/theme"')
		.replaceAll('from "preferences"', 'from "@/lib/feature-kit/preferences"')
		.replaceAll('from "export"', 'from "@/lib/feature-kit/export"')
		.replaceAll('from "format"', 'from "@/lib/feature-kit/format"')
		.replaceAll('from "uploader"', 'from "@/lib/feature-kit/uploader"')
}

function targetPathForKitFile(kitName, relativePath) {
	const normalized = relativePath.replace(/^feature\/[^/]+\/src\//, "")
	if (kitName === "theme" && relativePath.includes("feature/preferences/")) {
		const prefPath = relativePath.replace(/^feature\/preferences\/src\//, "")
		return `@lib/feature-kit/preferences/${prefPath}`
	}
	if (kitName === "data-table") {
		if (relativePath.includes("feature/export/")) {
			return `@lib/feature-kit/export/${relativePath.replace(/^feature\/export\/src\//, "")}`
		}
		if (relativePath.includes("packages/format/")) {
			return `@lib/feature-kit/format/${relativePath.replace(/^packages\/format\/src\//, "")}`
		}
	}
	if (kitName === "breadcrumb") {
		return `@lib/feature-kit/breadcrumb/${normalized.replace(/^breadcrumb\//, "")}`
	}
	if (kitName === "dashboard-shell") {
		return `@lib/feature-kit/shell/${normalized.replace(/^shell\//, "")}`
	}
	return `@lib/feature-kit/${kitName}/${normalized}`
}

async function walkFiles(dir) {
	try {
		await fs.access(dir)
	} catch {
		return []
	}
	const entries = await fs.readdir(dir, { withFileTypes: true })
	const out = []
	for (const entry of entries) {
		const abs = path.join(dir, entry.name)
		if (entry.isDirectory()) {
			out.push(...(await walkFiles(abs)))
		} else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.includes(".test.")) {
			out.push(abs)
		}
	}
	return out
}

function expandGlobs(globs) {
	/** @type {string[]} */
	const roots = []
	for (const pattern of globs) {
		if (pattern.startsWith("!")) continue
		const base = pattern.split("*")[0].replace(/\/$/, "")
		roots.push(path.join(ROOT, base))
	}
	return roots
}

async function stageKit(name, config) {
	const files = []
	const exclude = config.includeGlobs.filter((g) => g.startsWith("!")).map((g) => g.slice(1))
	const roots = expandGlobs(config.includeGlobs)
	const seen = new Set()
	for (const root of roots) {
		const absFiles = await walkFiles(root)
		for (const filePath of absFiles) {
			const rel = path.relative(ROOT, filePath).replaceAll("\\", "/")
			if (exclude.some((ex) => rel.startsWith(ex.replace(/\*\*$/, "").replace(/\/$/, "")))) {
				continue
			}
			if (seen.has(rel)) continue
			seen.add(rel)
			const raw = await fs.readFile(filePath, "utf8")
			const content = transformSource(raw, name)
			const target = targetPathForKitFile(name, rel)
			const stagingRel = target.replace(/^@lib\//, "lib/").replace(/^@/, "")
			const stagingPath = path.join(STAGING, stagingRel)
			await fs.mkdir(path.dirname(stagingPath), { recursive: true })
			await fs.writeFile(stagingPath, content)
			files.push({
				path: path.relative(GENERATED, stagingPath),
				type: "registry:lib",
				target: `${target}`,
			})
		}
	}
	return files
}

async function main() {
	await fs.rm(GENERATED, { recursive: true, force: true })
	await fs.mkdir(STAGING, { recursive: true })

	const items = []
	for (const [name, config] of Object.entries(KITS)) {
		const files = await stageKit(name, config)
		if (files.length === 0) {
			throw new Error(`No files staged for kit: ${name}`)
		}
		items.push({
			name,
			type: "registry:block",
			title: config.title,
			description: config.description,
			dependencies: config.dependencies ?? [],
			devDependencies: config.devDependencies ?? [],
			registryDependencies: config.registryDependencies ?? [],
			categories: config.categories ?? [],
			...(config.docs ? { docs: config.docs } : {}),
			files,
		})
	}

	for (const [name, config] of Object.entries(BLOCKS)) {
		const files = await stageBlock(name, config)
		items.push({
			name,
			type: "registry:block",
			title: config.title,
			description: config.description,
			dependencies: config.dependencies ?? [],
			devDependencies: [],
			registryDependencies: config.registryDependencies ?? [],
			categories: config.categories ?? ["blocks"],
			files,
		})
	}

	const registry = {
		$schema: "https://ui.shadcn.com/schema/registry.json",
		name: "feature-kit",
		homepage: SITE,
		items,
	}

	const registryPath = path.join(GENERATED, "registry.json")
	await fs.writeFile(registryPath, `${JSON.stringify(registry, null, 2)}\n`)

	await fs.mkdir(PUBLIC_R, { recursive: true })

	const result = spawnSync(
		"npx",
		["shadcn@latest", "build", registryPath, "-o", PUBLIC_R, "-c", GENERATED],
		{
			cwd: ROOT,
			stdio: "inherit",
		},
	)
	if (result.status !== 0) {
		process.exit(result.status ?? 1)
	}

	// Catalog for humans / tooling
	await fs.writeFile(
		path.join(PUBLIC_R, "registry.json"),
		`${JSON.stringify(
			{
				$schema: "https://ui.shadcn.com/schema/registry.json",
				name: "feature-kit",
				homepage: SITE,
				items: items.map(({ name, title, description }) => ({
					name,
					title,
					description,
					url: `${SITE}/r/${name}.json`,
				})),
			},
			null,
			2,
		)}\n`,
	)

	console.log(`Built ${items.length} registry items → ${PUBLIC_R}`)
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
