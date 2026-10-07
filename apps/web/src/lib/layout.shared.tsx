import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

import { DocsLayoutHeader } from "@/components/site/docs-layout-header"
import { DocsSidebarNavTitle } from "@/components/site/docs-sidebar-nav-title"

export function docsLayoutOptions(): BaseLayoutProps {
	return {
		nav: {
			enabled: true,
			component: <DocsLayoutHeader />,
		},
		slots: {
			navTitle: DocsSidebarNavTitle,
		},
		links: [],
		// Search UI lives in DocsHeaderSearch; RootProvider SearchProvider keeps Ctrl+K.
		searchToggle: {
			enabled: false,
		},
		themeSwitch: {
			enabled: false,
		},
	}
}
