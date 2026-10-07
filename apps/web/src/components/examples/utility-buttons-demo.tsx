"use client"

import { GoBackButton } from "layout"
import { DocsIconButton, RefreshIconButton } from "layout/navigation/utility-button"
import { useCallback, useState } from "react"

export function UtilityButtonsDemo() {
	const [refreshedAt, setRefreshedAt] = useState<string | null>(null)

	const handleRefresh = useCallback(async () => {
		await new Promise((resolve) => setTimeout(resolve, 900))
		setRefreshedAt(new Date().toLocaleTimeString())
	}, [])

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 p-4">
				<GoBackButton fallbackHref="/docs" />
				<DocsIconButton href="https://example.com/docs" page="utility-buttons" />
				<RefreshIconButton minPendingMs={600} onRefresh={handleRefresh} />
			</div>
			<p className="text-muted-foreground text-sm">
				{refreshedAt
					? `Last refreshed at ${refreshedAt}.`
					: "Use Refresh to see the shared loading spinner and disabled state."}
			</p>
		</div>
	)
}
