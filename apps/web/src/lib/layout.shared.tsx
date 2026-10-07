import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

import { DocsLayoutHeader } from "@/components/site/docs-layout-header"

export function docsLayoutOptions(): BaseLayoutProps {
	return {
		nav: {
			enabled: true,
			title: "Feature Kit",
			url: "/",
			component: <DocsLayoutHeader />,
		},
		links: [],
		searchToggle: {
			enabled: true,
		},
		themeSwitch: {
			enabled: true,
		},
	}
}
