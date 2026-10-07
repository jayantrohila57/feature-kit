import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

import { DocsLayoutHeader } from "@/components/site/docs-layout-header"
import { HiddenNavTitle } from "@/components/site/hidden-nav-title"

export function docsLayoutOptions(): BaseLayoutProps {
	return {
		nav: {
			enabled: true,
			title: null,
			url: "/",
			component: <DocsLayoutHeader />,
		},
		links: [],
		slots: {
			navTitle: HiddenNavTitle,
		},
		searchToggle: {
			enabled: false,
		},
		themeSwitch: {
			enabled: false,
		},
	}
}
