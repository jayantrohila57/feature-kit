import type { ComponentProps } from "react"

/** Lucide `lambda` path data (ISC) — single source for header, favicon, OG, PWA. */
export const LAMBDA_ICON_PATHS = [
	"M11.38 10 5 20",
	"M19 18a2 2 0 01-2 2c-4.87-.003-5.052-16-10-16a2 2 0 00-2 2",
] as const

export type LambdaIconProps = ComponentProps<"svg">

/** Stroke λ mark matching lucide-react `Lambda` (24×24 viewBox). */
export function LambdaIcon({
	className,
	stroke = "currentColor",
	strokeWidth = 2,
	...props
}: LambdaIconProps) {
	return (
		<svg
			aria-hidden
			className={className}
			fill="none"
			stroke={stroke}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}>
			{LAMBDA_ICON_PATHS.map((d) => (
				<path d={d} key={d} />
			))}
		</svg>
	)
}
