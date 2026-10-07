import { ImageResponse } from "next/og"

import { LAMBDA_ICON_PATHS } from "@/components/icons/lambda-icon"
import {
	BRAND_PRIMARY,
	BRAND_SURFACE_DARK,
	SITE_DESCRIPTION,
	SITE_NAME,
} from "@/lib/brand/lambda-mark"

export const alt = SITE_NAME
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
					justifyContent: "center",
					padding: "80px 96px",
					background: `linear-gradient(135deg, ${BRAND_SURFACE_DARK} 0%, #2a2340 45%, ${BRAND_PRIMARY} 100%)`,
					color: "white",
					fontFamily: "system-ui, sans-serif",
				}}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 32,
						marginBottom: 28,
					}}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: 120,
							height: 120,
							borderRadius: 28,
							background: BRAND_PRIMARY,
							boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
						}}>
						<svg
							fill="none"
							height="72"
							stroke="white"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							width="72"
							xmlns="http://www.w3.org/2000/svg">
							{LAMBDA_ICON_PATHS.map((d) => (
								<path d={d} key={d} />
							))}
						</svg>
					</div>
					<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
						<div style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
							{SITE_NAME}
						</div>
						<div style={{ fontSize: 32, opacity: 0.88, maxWidth: 720, lineHeight: 1.35 }}>
							{SITE_DESCRIPTION}
						</div>
					</div>
				</div>
			</div>
		),
		{ ...size },
	)
}
