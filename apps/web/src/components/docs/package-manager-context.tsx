"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun"

const STORAGE_KEY = "feature-kit:package-manager"

const PackageManagerContext = createContext<{
	manager: PackageManager
	setManager: (manager: PackageManager) => void
} | null>(null)

export function PackageManagerProvider({ children }: { children: React.ReactNode }) {
	const [manager, setManagerState] = useState<PackageManager>("pnpm")

	useEffect(() => {
		const stored = window.localStorage.getItem(STORAGE_KEY)
		if (stored === "npm" || stored === "pnpm" || stored === "yarn" || stored === "bun") {
			setManagerState(stored)
		}
	}, [])

	const setManager = (next: PackageManager) => {
		setManagerState(next)
		window.localStorage.setItem(STORAGE_KEY, next)
	}

	return (
		<PackageManagerContext.Provider value={{ manager, setManager }}>
			{children}
		</PackageManagerContext.Provider>
	)
}

export function usePackageManager() {
	const ctx = useContext(PackageManagerContext)
	if (!ctx) {
		throw new Error("usePackageManager must be used within PackageManagerProvider")
	}
	return ctx
}
