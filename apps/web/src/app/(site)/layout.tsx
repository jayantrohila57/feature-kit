import type { ReactNode } from "react"

import { FeatureKitHeader } from "@/components/site/feature-kit-header"

export default function SiteLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-dvh flex-col">
			<FeatureKitHeader />
			<div className="relative flex flex-1 flex-col">{children}</div>
		</div>
	)
}
