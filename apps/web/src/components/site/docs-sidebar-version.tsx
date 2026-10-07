import type { ComponentProps } from "react"

import { DocsSidebarVersionTrigger } from "@/components/site/docs-sidebar-version-ui"

export function DocsSidebarVersionTitle(props: ComponentProps<typeof DocsSidebarVersionTrigger>) {
	return <DocsSidebarVersionTrigger {...props} />
}
