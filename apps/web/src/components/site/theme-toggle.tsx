"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { type ComponentProps, useSyncExternalStore } from "react"

import { Button } from "@/packages/ui/components/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/packages/ui/components/tooltip"
import { cn } from "@/packages/ui/lib/utils"

type ThemeToggleProps = {
	className?: string
	size?: ComponentProps<typeof Button>["size"]
	variant?: ComponentProps<typeof Button>["variant"]
	tooltip?: string
}

const emptySubscribe = () => () => {}

/** Server snapshot is false so theme icons do not mismatch hydration. */
function useMounted() {
	return useSyncExternalStore(emptySubscribe, () => true, () => false)
}

export function ThemeToggle({
	className,
	size = "icon",
	variant = "ghost",
	tooltip,
}: ThemeToggleProps) {
	const { resolvedTheme, setTheme } = useTheme()
	const mounted = useMounted()

	const isDark = resolvedTheme === "dark"
	const label = isDark ? "Switch to light theme" : "Switch to dark theme"
	const ariaLabel = tooltip ?? (mounted ? label : "Toggle theme")

	const button = (
		<Button
			aria-label={ariaLabel}
			className={cn(variant === "ghost" && "text-muted-foreground hover:text-foreground", className)}
			onClick={() => {
				if (!mounted) return
				setTheme(isDark ? "light" : "dark")
			}}
			size={size}
			type="button"
			variant={variant}>
			{mounted ? (
				isDark ? (
					<Sun className="size-4" />
				) : (
					<Moon className="size-4" />
				)
			) : (
				<span aria-hidden className="size-4" />
			)}
		</Button>
	)

	if (!tooltip) {
		return button
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>{button}</TooltipTrigger>
			<TooltipContent>{tooltip}</TooltipContent>
		</Tooltip>
	)
}
