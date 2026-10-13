"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ComponentProps } from "react"

import { ThemePreferenceSync } from "./theme.use-sync-preferences"

export type ThemeProviderProps = ComponentProps<typeof NextThemesProvider> & {
	/** When true, writes theme changes into preferences localStorage via `applyThemePreference`. */
	syncPreferences?: boolean
}

export function ThemeProvider({
	attribute = "class",
	defaultTheme = "system",
	enableSystem = true,
	disableTransitionOnChange = true,
	syncPreferences = true,
	children,
	...props
}: ThemeProviderProps) {
	return (
		<NextThemesProvider
			attribute={attribute}
			defaultTheme={defaultTheme}
			enableSystem={enableSystem}
			disableTransitionOnChange={disableTransitionOnChange}
			{...props}>
			{syncPreferences ? <ThemePreferenceSync /> : null}
			{children}
		</NextThemesProvider>
	)
}
