import type { MetadataRoute } from "next"

import { BRAND_PRIMARY, BRAND_SURFACE_LIGHT, SITE_DESCRIPTION, SITE_NAME } from "@/lib/brand/lambda-mark"

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: SITE_NAME,
		short_name: SITE_NAME,
		description: SITE_DESCRIPTION,
		start_url: "/",
		display: "standalone",
		background_color: BRAND_SURFACE_LIGHT,
		theme_color: BRAND_PRIMARY,
		icons: [
			{
				src: "/icon",
				sizes: "32x32",
				type: "image/png",
			},
			{
				src: "/apple-icon",
				sizes: "180x180",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/apple-icon",
				sizes: "180x180",
				type: "image/png",
				purpose: "maskable",
			},
		],
	}
}
