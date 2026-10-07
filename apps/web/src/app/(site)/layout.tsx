import type { ReactNode } from "react"

import { FeatureKitHeader } from "@/components/site/feature-kit-header"

export default function SiteLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col">
			<FeatureKitHeader />
			{children}
		</div>
	)
}
