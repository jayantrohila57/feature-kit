import { getSiteOrigin } from "@/lib/site-url"

export function getRegistryBaseUrl(): string {
	return `${getSiteOrigin()}/r`
}

export function getRegistryItemUrl(item: string): string {
	return `${getRegistryBaseUrl()}/${item}.json`
}
