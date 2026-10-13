"use client"

import { useTheme } from "next-themes"
import { applyThemePreference } from "preferences"
import type { ThemePreference } from "preferences"
import { useEffect } from "react"

function toThemePreference(theme: string | undefined): ThemePreference | undefined {
	if (theme === "light" || theme === "dark" || theme === "system") {
		return theme
	}
	return undefined
}

/** Mirrors next-themes changes into the preferences storage key (no DOM mutation). */
export function ThemePreferenceSync() {
	const { theme } = useTheme()

	useEffect(() => {
		const pref = toThemePreference(theme)
		if (pref) {
			applyThemePreference(pref)
		}
	}, [theme])

	return null
}
