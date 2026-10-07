"use client"

import { ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { memo, useCallback } from "react"

import { Button } from "@/packages/ui/components/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/packages/ui/components/tooltip"

import { DEFAULT_BACK_FALLBACK_HREF, shouldUseFallbackOnBack } from "./back-button-utils"

export type GoBackButtonProps = {
	/** Used when history cannot go back in-app. Defaults to `/examples`. */
	fallbackHref?: string
}

export const GoBackButton = memo(function GoBackButton({
	fallbackHref = DEFAULT_BACK_FALLBACK_HREF,
}: GoBackButtonProps) {
	const t = useTranslations()
	const router = useRouter()
	const label = t("common.back")

	const handleGoBack = useCallback(() => {
		if (
			shouldUseFallbackOnBack({
				historyLength: window.history.length,
				currentOrigin: window.location.origin,
				referrer: document.referrer,
			})
		) {
			router.push(fallbackHref)
			return
		}

		router.back()
	}, [fallbackHref, router])

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					type="button"
					size="icon"
					variant="outline"
					onClick={handleGoBack}
					aria-label={label}>
					<ArrowLeftIcon aria-hidden className="size-4" />
				</Button>
			</TooltipTrigger>
			<TooltipContent side="bottom">{label}</TooltipContent>
		</Tooltip>
	)
})
