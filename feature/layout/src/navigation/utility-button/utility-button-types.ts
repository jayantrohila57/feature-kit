import type { LucideIcon } from "lucide-react"
import type { ComponentProps } from "react"

import type { TooltipContent } from "@/packages/ui/components/tooltip"

export type UtilityIconButtonVariant =
	| "default"
	| "outline"
	| "secondary"
	| "ghost"
	| "destructive"
	| "link"

export type UtilityIconButtonProps = {
	/** Accessible name and default tooltip text. */
	label: string
	tooltipLabel?: string | undefined
	loadingLabel?: string | undefined
	icon: LucideIcon
	onClick?: (() => void) | undefined
	href?: string | undefined
	variant?: UtilityIconButtonVariant | undefined
	pending?: boolean | undefined
	isLoading?: boolean | undefined
	tooltipSide?: ComponentProps<typeof TooltipContent>["side"]
	/** When `href` is set, open in a new tab with safe rel attributes. */
	openInNewTab?: boolean | undefined
	className?: string | undefined
	disabled?: boolean | undefined
}
