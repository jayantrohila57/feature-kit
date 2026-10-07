import { ImageResponse } from "next/og"

import { LAMBDA_ICON_PATHS } from "@/components/icons/lambda-icon"
import { BRAND_PRIMARY } from "@/lib/brand/lambda-mark"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: BRAND_PRIMARY,
					borderRadius: 36,
				}}>
				<svg
					fill="none"
					height="112"
					stroke="white"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2.25"
					viewBox="0 0 24 24"
					width="112"
					xmlns="http://www.w3.org/2000/svg">
					{LAMBDA_ICON_PATHS.map((d) => (
						<path d={d} key={d} />
					))}
				</svg>
			</div>
		),
		{ ...size },
	)
}
