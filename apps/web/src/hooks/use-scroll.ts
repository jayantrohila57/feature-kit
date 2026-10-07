"use client"

import { useCallback, useEffect, useState } from "react"

function readScrollY() {
	if (typeof window === "undefined") {
		return 0
	}

	const windowY = window.scrollY
	const docY = document.documentElement.scrollTop
	const bodyY = document.body.scrollTop

	const main = document.querySelector<HTMLElement>("[data-layout-main]")
	const mainY = main?.scrollTop ?? 0

	return Math.max(windowY, docY, bodyY, mainY)
}

export function useScroll(threshold: number) {
	const [scrolled, setScrolled] = useState(false)

	const update = useCallback(() => {
		setScrolled(readScrollY() > threshold)
	}, [threshold])

	useEffect(() => {
		update()

		const onScroll = () => {
			update()
		}

		window.addEventListener("scroll", onScroll, { passive: true })
		window.addEventListener("resize", onScroll, { passive: true })
		document.addEventListener("scroll", onScroll, { passive: true, capture: true })

		return () => {
			window.removeEventListener("scroll", onScroll)
			window.removeEventListener("resize", onScroll)
			document.removeEventListener("scroll", onScroll, true)
		}
	}, [update])

	return scrolled
}
