import type { Messages } from "next-intl"

/** Expand dot-delimited JSON keys into the nested shape next-intl resolves at runtime. */
export function nestFlatMessages(flat: Record<string, unknown>): Messages {
	const nested: Record<string, unknown> = {}

	for (const [key, value] of Object.entries(flat)) {
		if (!key.includes(".")) {
			nested[key] = value
			continue
		}

		const parts = key.split(".")
		const leaf = parts[parts.length - 1]
		if (!leaf) continue

		let current = nested

		for (const part of parts.slice(0, -1)) {
			const existing = current[part]

			if (typeof existing !== "object" || existing === null || Array.isArray(existing)) {
				current[part] = {}
			}

			current = current[part] as Record<string, unknown>
		}

		current[leaf] = value
	}

	return nested as Messages
}
