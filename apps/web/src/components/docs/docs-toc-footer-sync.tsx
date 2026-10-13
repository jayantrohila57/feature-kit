"use client"

import { useEffect } from "react"

const FOOTER_SELECTOR = "[data-docs-site-footer]"
const TOC_SELECTOR = "#nd-toc"
const HIDDEN_CLASS = "docs-toc--site-footer-visible"

/**
 * Hides the desktop TOC when the docs site footer enters the viewport so it never
 * overlaps the footer (Intent UI–style scroll behavior).
 */
export function DocsTocFooterSync() {
	useEffect(() => {
		const footer = document.querySelector(FOOTER_SELECTOR)
		const toc = document.querySelector(TOC_SELECTOR)
		if (!footer || !toc) return

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0]
				if (!entry) return
				toc.classList.toggle(HIDDEN_CLASS, entry.isIntersecting)
			},
			{ root: null, threshold: 0, rootMargin: "0px 0px -1px 0px" },
		)

		observer.observe(footer)
		return () => observer.disconnect()
	}, [])

	return null
}
