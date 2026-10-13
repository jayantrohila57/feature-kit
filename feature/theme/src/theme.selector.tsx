"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import type { ComponentProps } from "react"
import { useSyncExternalStore } from "react"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/packages/ui/components/dropdown-menu"
import { Button } from "@/packages/ui/components/button"
import { cn } from "@/packages/ui/lib/utils"

type ThemeSelectorProps = {
	className?: string
	size?: ComponentProps<typeof Button>["size"]
	variant?: ComponentProps<typeof Button>["variant"]
	label?: string
}

const emptySubscribe = () => () => {}

function useMounted() {
	return useSyncExternalStore(emptySubscribe, () => true, () => false)
}

export function ThemeSelector({
	className,
	size = "sm",
	variant = "outline",
	label = "Theme",
}: ThemeSelectorProps) {
	const { theme, setTheme } = useTheme()
	const mounted = useMounted()
	const value = mounted ? (theme ?? "system") : "system"

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					aria-label={label}
					className={cn("gap-2", className)}
					size={size}
					type="button"
					variant={variant}>
					<Sun className="size-4 dark:hidden" />
					<Moon className="hidden size-4 dark:inline" />
					<span className="hidden sm:inline">{label}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-40">
				<DropdownMenuLabel className="text-muted-foreground text-xs">{label}</DropdownMenuLabel>
				<DropdownMenuRadioGroup onValueChange={setTheme} value={value}>
					<DropdownMenuRadioItem value="light">
						<Sun className="size-4" />
						Light
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="dark">
						<Moon className="size-4" />
						Dark
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="system">
						<Monitor className="size-4" />
						System
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
