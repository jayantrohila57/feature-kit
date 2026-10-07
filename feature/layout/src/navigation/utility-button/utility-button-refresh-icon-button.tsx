"use client"

import { RefreshCwIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { memo, useCallback, useState } from "react"

import { UtilityIconButton } from "./utility-button-utility-icon-button"
import type { UtilityIconButtonProps } from "./utility-button-types"

type RefreshIconButtonProps = {
	onRefresh: () => void | Promise<void>
	/** Defaults to `common.refresh.label`. */
	label?: string | undefined
	/** Simulated minimum pending duration for demos (ms). */
	minPendingMs?: number | undefined
} & Pick<UtilityIconButtonProps, "variant" | "tooltipSide" | "className">

export const RefreshIconButton = memo(function RefreshIconButton({
	onRefresh,
	label,
	minPendingMs = 0,
	variant,
	tooltipSide,
	className,
}: RefreshIconButtonProps) {
	const t = useTranslations()
	const resolvedLabel = label ?? t("common.refresh.label")
	const [pending, setPending] = useState(false)

	const handleClick = useCallback(async () => {
		setPending(true)
		const started = Date.now()
		try {
			await onRefresh()
		} finally {
			const elapsed = Date.now() - started
			const remaining = minPendingMs - elapsed
			if (remaining > 0) {
				await new Promise((resolve) => setTimeout(resolve, remaining))
			}
			setPending(false)
		}
	}, [minPendingMs, onRefresh])

	return (
		<UtilityIconButton
			icon={RefreshCwIcon}
			label={resolvedLabel}
			loadingLabel={t("common.loading")}
			onClick={() => {
				void handleClick()
			}}
			pending={pending}
			tooltipSide={tooltipSide}
			variant={variant}
			className={className}
		/>
	)
})
