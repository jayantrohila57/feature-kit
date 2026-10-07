"use client"

import { Loader2Icon } from "lucide-react"
import { memo } from "react"

import { Button } from "@/packages/ui/components/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/packages/ui/components/tooltip"
import { cn } from "@/packages/ui/lib/utils"

import type { UtilityIconButtonProps } from "./utility-button-types"

export const UtilityIconButton = memo(function UtilityIconButton({
	label,
	tooltipLabel,
	loadingLabel,
	icon: Icon,
	onClick,
	href,
	variant = "outline",
	pending,
	isLoading,
	tooltipSide = "bottom",
	openInNewTab,
	className,
	disabled,
}: UtilityIconButtonProps) {
	const loading = pending === true || isLoading === true
	const isDisabled = disabled === true || loading
	const tooltipText = loading ? (loadingLabel ?? label) : (tooltipLabel ?? label)

	const iconNode = loading ? (
		<Loader2Icon aria-hidden className="size-4 animate-spin" />
	) : (
		<Icon aria-hidden className="size-4" />
	)

	const buttonProps = {
		size: "icon" as const,
		variant,
		className: cn(className),
		"aria-label": label,
		"aria-busy": loading || undefined,
		disabled: isDisabled,
	}

	const trigger =
		href && !onClick ? (
			<Button {...buttonProps} asChild>
				<a
					href={href}
					{...(openInNewTab
						? { target: "_blank", rel: "noopener noreferrer" }
						: {})}>
					{iconNode}
				</a>
			</Button>
		) : (
			<Button {...buttonProps} type="button" onClick={onClick}>
				{iconNode}
			</Button>
		)

	return (
		<Tooltip>
			<TooltipTrigger asChild>{trigger}</TooltipTrigger>
			<TooltipContent side={tooltipSide}>{tooltipText}</TooltipContent>
		</Tooltip>
	)
})
